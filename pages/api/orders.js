import dbConnect from '../../lib/dbConnect';
import Order from '../../models/Order';
import Item from '../../models/Item';
import Store from '../../models/Store';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const { user, store, items, address } = req.body;
      console.log('ORDER POST BODY:', req.body);
      if (!user || !store || !items || !address) return res.status(400).json({ message: 'Missing fields' });
      // Check if user exists
      const userExists = await User.findById(user);
      if (!userExists) return res.status(400).json({ message: 'User not found' });
      // Check if store exists
      const storeExists = await Store.findById(store);
      if (!storeExists) return res.status(400).json({ message: 'Store not found' });
      // Check if all items exist
      for (const entry of items) {
        const itemExists = await Item.findById(entry.item);
        if (!itemExists) return res.status(400).json({ message: `Item not found: ${entry.item}` });
      }
      const order = await Order.create({ user, store, items, address });
      return res.status(201).json(order);
    } catch (err) {
      console.error('ORDER ERROR:', err);
      return res.status(500).json({ message: err.message, stack: err.stack });
    }
  }
  if (req.method === 'GET') {
    const { userId, storeId } = req.query;
    let filter = {};
    if (userId) filter.user = userId;
    if (storeId) filter.store = storeId;
    const orders = await Order.find(filter).populate('user', 'email').populate('store', 'name').populate('items.item', 'name price');
    return res.status(200).json(orders);
  }
  if (req.method === 'PATCH') {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ message: 'Missing fields' });
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return res.status(200).json(order);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
