import dbConnect from '../../lib/dbConnect';
import Store from '../../models/Store';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const stores = await Store.find().populate('owner', 'email');
    return res.status(200).json(stores);
  }
  if (req.method === 'POST') {
    const { name, owner, address } = req.body;
    if (!name || !owner) return res.status(400).json({ message: 'Name and owner required' });
    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: 'Owner not found' });
    const store = await Store.create({ name, owner, address });
    return res.status(201).json(store);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
