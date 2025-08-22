import dbConnect from '../../lib/dbConnect';
import Item from '../../models/Item';

export default async function handler(req, res) {
  await dbConnect();
  const items = await Item.find();
  res.status(200).json(items);
}
