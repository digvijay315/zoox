const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: false,
    },
    orderType: {
      type: String,
      enum: ["Table", "Swiggy", "Zomato", "Parcel"],
      default: "Table",
    },
    orderDisplayId: {
      type: String,
    },
    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
        }
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Billed"],
      default: "Active",
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      default: null,
    },
    customerName: {
      type: String,
      default: null,
    },
    customerMobile: {
      type: String,
      default: null,
    },
    customerEmail: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
