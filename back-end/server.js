const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Product = require("./models/product");
const Device = require("./models/device");

const app = express();
app.use(express.json());


// Create Product
app.post("/product", async (req, res) => {
  const { name } = req.body;

  try {
    const productID = uuidv4();
    const product = new Product({ productID, name });
    await product.save();

    res.status(201).json({ productID, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Devices
app.post("/product/:productID/devices", async (req, res) => {
  const { productID } = req.params;
  const { deviceCount } = req.body;

  try {
    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const addedDevices = [];
    for (let i = 0; i < deviceCount; i++) {
      const deviceID = uuidv4();
      const device = new Device({ deviceID, productID });
      await device.save();

      addedDevices.push(deviceID);
      product.devices.push(device._id);
    }

    await product.save();
    res.status(201).json({ addedDevices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start/Stop Devices
app.post("/product/:productID/devices/control", async (req, res) => {
  const { productID } = req.params;
  const { devices } = req.body;

  try {
    const updatedDevices = [];
    const notFoundDevices = [];

    for (const { deviceID, action } of devices) {
      const device = await Device.findOne({ deviceID, productID });
      if (device) {
        device.active = action === "start";
        await device.save();
        updatedDevices.push({ deviceID, action });
      } else {
        notFoundDevices.push(deviceID);
      }
    }

    res.status(200).json({
      message: "Device control operation completed",
      updatedDevices,
      notFoundDevices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check Devices Running
app.post("/devices/running", async (req, res) => {
  const { productID } = req.body;

  try {
    const runningDevices = await Device.find({ productID, active: true });

    res.status(200).json({
      status: "success",
      runningDevicesCount: runningDevices.length,
      runningDevices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define Product Components
app.post("/product/:productID/definition", async (req, res) => {
  const { productID } = req.params;
  const { components } = req.body;

  try {
    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.components = components;
    await product.save();

    res.status(200).json({ message: "Product definition updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Product Definition
app.get("/product/:productID/definition", async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findOne({ productID }).populate("devices");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Put Components
app.put("/product/:productID/components", async (req, res) => {
  const { productID } = req.params;
  const { updates } = req.body;

  try {
    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.keys(updates).forEach((key) => {
      product.components.set(key, updates[key]);
    });

    await product.save();
    res.status(200).json({
      message: "Components updated successfully",
      components: product.components,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Definition
app.delete("/product/:productID/definition", async (req, res) => {
  const { productID } = req.params;

  try {
    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.components = new Map();
    await product.save();

    res.status(200).json({ message: "Product definition deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Component
app.delete("/product/:productID/components/:componentName", async (req, res) => {
  const { productID, componentName } = req.params;

  try {
    const product = await Product.findOne({ productID });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.components.has(componentName)) {
      product.components.delete(componentName);
      await product.save();

      res.status(200).json({
        message: `Component '${componentName}' removed successfully`,
      });
    } else {
      res.status(404).json({ message: "Component not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Data
app.post("/generate_data", async (req, res) => {
  const { productID } = req.body;

  try {
    // Placeholder for data generation logic
    res.status(200).json({ message: "Data generated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Data
app.post("/get_data", async (req, res) => {
  const { productID } = req.body;

  try {
    // Placeholder for retrieving generated data
    res.status(200).json({ message: "Data retrieved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MongoDB Connection
mongoose.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
});




