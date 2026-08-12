const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNo: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: false,
      default: 0,
    },
    type: {
      type: String,
      enum: ["Table", "Cabin"],
      default: "Table",
    },
    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },
    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);
