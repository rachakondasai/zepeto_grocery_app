import { connectDB } from '@/utils/db';
import { Store } from '@/models/Store';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'POST') {
    const { storeName, password } = req.body;
    const store = await Store.findOne({ name: storeName, password });
    if (store) {
      res.status(200).json({ success: true, storeId: store._id });
    } else {
      res.status(401).json({ success: false });
    }
  }
}