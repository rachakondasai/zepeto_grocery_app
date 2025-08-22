// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  location: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export { Product }; // ✅ named export (not default)