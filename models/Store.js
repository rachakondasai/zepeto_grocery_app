import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true }, // basic login, not hashed
});

export const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);