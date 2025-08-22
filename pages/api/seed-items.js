import dbConnect from '../../lib/dbConnect';
import Item from '../../models/Item';
import Store from '../../models/Store';

const demoItems = [
  // Kitchen
  { name: 'Rice', price: 40, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 1' },
  { name: 'Wheat Flour', price: 35, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 1' },
  { name: 'Cooking Oil', price: 120, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 2' },
  // Home
  { name: 'Detergent', price: 60, category: 'Home', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc695c', storeName: 'Store 2' },
  { name: 'Toilet Paper', price: 30, category: 'Home', image: 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c1b9b', storeName: 'Store 3' },
  // Electronics
  { name: 'LED Bulb', price: 80, category: 'Electronics', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 3' },
  { name: 'Extension Cord', price: 150, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 1' },
  // Skincare
  { name: 'Face Wash', price: 90, category: 'Skincare', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', storeName: 'Store 2' },
  { name: 'Moisturizer', price: 110, category: 'Skincare', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 3' },
];

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  // Find stores by name
  const stores = await Store.find();
  const storeMap = Object.fromEntries(stores.map(s => [s.name, s._id]));
  // Insert items
  const itemsToInsert = demoItems.map(item => ({
    ...item,
    store: storeMap[item.storeName] || stores[0]?._id,
  }));
  await Item.insertMany(itemsToInsert);
  res.status(201).json({ message: 'Demo items added!' });
}
