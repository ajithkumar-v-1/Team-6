const mongoose = require("mongoose")
const DeviceSchema = new mongoose.Schema({
    deviceID: { type: String, required: true, unique: true },
    productID: { type: String, required: true },
    active: { type: Boolean, default: false },
  });
  
  module.exports = mongoose.model("Device", DeviceSchema);
  