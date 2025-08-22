import dbConnect from '../../lib/dbConnect';
import Item from '../../models/Item';
import Store from '../../models/Store';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const { storeId } = req.query;
    const filter = storeId ? { store: storeId } : {};
    const items = await Item.find(filter).populate('store', 'name');
    return res.status(200).json(items);
  }
  if (req.method === 'POST') {
    const { name, price, store, image } = req.body;
    if (!name || !price || !store) return res.status(400).json({ message: 'Name, price, and store required' });
    const storeExists = await Store.findById(store);
    if (!storeExists) return res.status(404).json({ message: 'Store not found' });
    const item = await Item.create({ name, price, store, image });
    return res.status(201).json(item);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
