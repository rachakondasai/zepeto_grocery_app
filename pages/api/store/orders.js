import { connectDB } from '@/utils/db';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  await connectDB();
  const { storeId } = req.query;
  const orders = await Order.find({ store: storeId });
  res.status(200).json(orders);
}