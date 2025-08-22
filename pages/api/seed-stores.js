import dbConnect from '../../lib/dbConnect';
import Store from '../../models/Store';
import User from '../../models/User';

const demoStores = [
  { name: 'Store 1', address: 'Main Road, Village', ownerEmail: 'owner1@example.com' },
  { name: 'Store 2', address: 'Market Street, Village', ownerEmail: 'owner2@example.com' },
  { name: 'Store 3', address: 'Bus Stand, Village', ownerEmail: 'owner3@example.com' },
];

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  // Find or create owners
  const owners = await Promise.all(
    demoStores.map(async s => {
      let user = await User.findOne({ email: s.ownerEmail });
      if (!user) user = await User.create({ email: s.ownerEmail, password: 'password' });
      return user;
    })
  );
  // Insert stores
  const storesToInsert = demoStores.map((s, i) => ({
    name: s.name,
    address: s.address,
    owner: owners[i]._id,
  }));
  await Store.insertMany(storesToInsert);
  res.status(201).json({ message: 'Demo stores added!' });
}
