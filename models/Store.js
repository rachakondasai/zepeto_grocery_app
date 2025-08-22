import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Store || mongoose.model('Store', StoreSchema);
