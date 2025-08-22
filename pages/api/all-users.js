import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    const users = await User.find({}, 'email _id');
    return res.status(200).json(users);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
