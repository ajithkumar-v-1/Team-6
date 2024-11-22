const mongoose = require("mongoose");
const { Schema } = mongoose;

const ComponentSchema = new Schema({
  type: String,
  unit: String,
  range: {
    min: Number,
    max: Number,
  },
  state: [Schema.Types.Mixed],
});

const ProductSchema = new Schema({
  productID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  components: { type: Map, of: ComponentSchema },
  devices: [{ type: Schema.Types.ObjectId, ref: "Device" }],
});

module.exports = mongoose.model("Product", ProductSchema);
