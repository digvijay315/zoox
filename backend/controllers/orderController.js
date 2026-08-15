const Order = require("../models/Order");
const Table = require("../models/Table");
const Invoice = require("../models/Invoice");
const Dish = require("../models/Dish");
const InventoryItem = require("../models/InventoryItem");

// @desc    Create or update order
// @route   POST /api/orders
// @access  Private (Staff)
exports.createOrUpdateOrder = async (req, res) => {
  try {
    const { tableId, items, subTotal, tax, grandTotal, orderType, orderId } = req.body;
    
    const type = orderType || "Table";

    let order;

    if (type === "Table") {
      let table = await Table.findOne({ _id: tableId });
      if (!table) {
        return res.status(404).json({ success: false, message: "Table not found" });
      }

      if (table.currentOrderId) {
        order = await Order.findOne({ _id: table.currentOrderId });
        if (order) {
          order.items = items;
          order.subTotal = subTotal;
          order.tax = tax;
          order.grandTotal = grandTotal;
          await order.save();
        } else {
          order = await Order.create({
            table: tableId,
            orderType: type,
            items,
            subTotal,
            tax,
            grandTotal,
            createdBy: req.user._id,
          });
          table.currentOrderId = order._id;
          table.status = "Occupied";
          await table.save();
        }
      } else {
        order = await Order.create({
          table: tableId,
          orderType: type,
          items,
          subTotal,
          tax,
          grandTotal,
          createdBy: req.user._id,
        });
        table.currentOrderId = order._id;
        table.status = "Occupied";
        await table.save();
      }
    } else {
      // Virtual Order (Swiggy, Zomato, Parcel)
      if (orderId) {
        // Update existing virtual order
        order = await Order.findOne({ _id: orderId });
        if (order) {
          order.items = items;
          order.subTotal = subTotal;
          order.tax = tax;
          order.grandTotal = grandTotal;
          await order.save();
        }
      } else {
        // Create new virtual order
        const count = await Order.countDocuments({ orderType: type });
        let prefix = "PAR";
        if (type === "Swiggy") prefix = "SW";
        if (type === "Zomato") prefix = "ZOM";
        
        const displayId = `${prefix}-${count + 1}`;
        
        order = await Order.create({
          orderType: type,
          orderDisplayId: displayId,
          items,
          subTotal,
          tax,
          grandTotal,
          createdBy: req.user._id,
        });
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active order for a table
// @route   GET /api/orders/active/:tableId
// @access  Private
exports.getActiveOrder = async (req, res) => {
  try {
    const table = await Table.findOne({ _id: req.params.tableId }).populate("currentOrderId");
    if (!table || !table.currentOrderId) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: table.currentOrderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active virtual orders (Swiggy/Zomato/Parcel)
// @route   GET /api/orders/virtual/active
// @access  Private
exports.getActiveVirtualOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      orderType: { $ne: "Table" },
      status: "Active" 
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Checkout and generate bill
// @route   POST /api/orders/:orderId/checkout
// @access  Private
exports.checkoutOrder = async (req, res) => {
  try {
    const { customerName, customerMobile, customerEmail, paymentMode, discountPercentage = 0 } = req.body;
    
    const order = await Order.findOne({ _id: req.params.orderId }).populate("table");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Billed") {
      return res.status(400).json({ success: false, message: "Order is already billed" });
    }

    let cName = customerName || "Guest";
    if (order.orderType === "Table" && order.table && !customerName) {
      cName = `Table ${order.table.tableNo}`;
    } else if (order.orderType !== "Table" && !customerName) {
      cName = order.orderDisplayId;
    }

    // Calculate new totals with discount
    const discountAmount = Math.round((order.subTotal * discountPercentage / 100) * 100) / 100;
    const newTax = Math.round(((order.subTotal - discountAmount) * 0.05) * 100) / 100;
    const newGrandTotal = Math.round((order.subTotal - discountAmount + newTax) * 100) / 100;

    // Create Invoice
    const invoice = await Invoice.create({
      customerName: cName,
      customerMobile: customerMobile || "N/A",
      customerEmail: customerEmail || "",
      paymentMode: paymentMode || "Cash",
      items: order.items,
      subTotal: order.subTotal,
      discountPercentage,
      discountAmount,
      tax: newTax,
      grandTotal: newGrandTotal,
      createdBy: req.user._id,
      tableId: order.table ? order.table._id : null,
      orderId: order._id,
      status: "Paid",
    });

    // Update Order
    order.status = "Billed";
    order.paymentMode = paymentMode || "Cash";
    order.customerName = cName;
    order.discountPercentage = discountPercentage;
    order.discountAmount = discountAmount;
    order.tax = newTax;
    order.grandTotal = newGrandTotal;
    if (customerMobile) {
      order.customerMobile = customerMobile;
    }
    if (customerEmail) {
      order.customerEmail = customerEmail;
    }
    await order.save();

    // Deduct stock for ingredients based on the recipe
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const dish = await Dish.findById(item.dishId);
        if (dish && dish.recipe && dish.recipe.length > 0) {
          for (const recipeItem of dish.recipe) {
            const inventoryItem = await InventoryItem.findById(recipeItem.item);
            if (inventoryItem) {
              inventoryItem.currentStock -= (recipeItem.quantity * item.quantity);
              await inventoryItem.save();
            }
          }
        }
      }
    }

    // Free the table if applicable
    if (order.orderType === "Table" && order.table) {
      const table = await Table.findById(order.table._id);
      if (table) {
        table.status = "Available";
        table.currentOrderId = null;
        await table.save();
      }
    }

    const invoiceObj = invoice.toObject();
    if (order.table) {
      invoiceObj.tableNo = order.table.tableNo;
    }

    res.status(200).json({ success: true, data: invoiceObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin reports)
// @route   GET /api/orders/all
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";
    const paymentMode = req.query.paymentMode || "";
    const orderType = req.query.orderType || "";
    const fromDate = req.query.fromDate || "";
    const toDate = req.query.toDate || "";
    
    let query = {};
    if (search) {
      query.$or = [
        { orderDisplayId: { $regex: search, $options: "i" } },
        { orderType: { $regex: search, $options: "i" } }
      ];
    }
    if (paymentMode) {
      query.paymentMode = paymentMode;
    }
    if (orderType) {
      query.orderType = orderType;
    }
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(new Date(fromDate).setHours(0, 0, 0, 0));
      }
      if (toDate) {
        query.createdAt.$lte = new Date(new Date(toDate).setHours(23, 59, 59, 999));
      }
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("table")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: orders,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an order (KOT)
// @route   DELETE /api/orders/:orderId
// @access  Private (Staff/Admin)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Billed") {
      return res.status(400).json({ success: false, message: "Cannot cancel an already billed order" });
    }

    // Free table if it's a table order
    if (order.orderType === "Table" && order.table) {
      const table = await Table.findById(order.table);
      if (table && table.currentOrderId?.toString() === order._id.toString()) {
        table.status = "Available";
        table.currentOrderId = null;
        await table.save();
      }
    }

    await Order.deleteOne({ _id: order._id });

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
