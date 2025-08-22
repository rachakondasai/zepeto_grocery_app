import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  image: { type: String },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
