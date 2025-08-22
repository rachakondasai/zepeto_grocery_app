import dbConnect from '../../lib/dbConnect';
import Item from '../../models/Item';
import Store from '../../models/Store';

const demoItems = [
  // Fruits
  { name: 'Apple', price: 60, category: 'Fruits', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce', storeName: 'Store 1' },
  { name: 'Banana', price: 30, category: 'Fruits', image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8e9', storeName: 'Store 1' },
  { name: 'Orange', price: 50, category: 'Fruits', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 2' },
  { name: 'Grapes', price: 80, category: 'Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', storeName: 'Store 2' },
  { name: 'Mango', price: 100, category: 'Fruits', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 3' },
  { name: 'Pineapple', price: 90, category: 'Fruits', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', storeName: 'Store 3' },
  // Vegetables
  { name: 'Tomato', price: 25, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 1' },
  { name: 'Potato', price: 20, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 1' },
  { name: 'Onion', price: 30, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 2' },
  { name: 'Carrot', price: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 3' },
  { name: 'Broccoli', price: 60, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 2' },
  { name: 'Spinach', price: 35, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 3' },
  // Staples
  { name: 'Rice', price: 40, category: 'Staples', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 1' },
  { name: 'Wheat Flour', price: 35, category: 'Staples', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 1' },
  { name: 'Sugar', price: 45, category: 'Staples', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 2' },
  { name: 'Salt', price: 10, category: 'Staples', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', storeName: 'Store 2' },
  { name: 'Lentils', price: 55, category: 'Staples', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 3' },
  { name: 'Cooking Oil', price: 120, category: 'Staples', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 1' },
  // Snacks
  { name: 'Chips', price: 20, category: 'Snacks', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 3' },
  { name: 'Biscuits', price: 25, category: 'Snacks', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 3' },
  { name: 'Namkeen', price: 35, category: 'Snacks', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 2' },
  { name: 'Chocolate', price: 50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', storeName: 'Store 1' },
  // Beverages
  { name: 'Tea', price: 60, category: 'Beverages', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 1' },
  { name: 'Coffee', price: 80, category: 'Beverages', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', storeName: 'Store 2' },
  { name: 'Juice', price: 70, category: 'Beverages', image: 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c1b9b', storeName: 'Store 3' },
  { name: 'Soft Drink', price: 45, category: 'Beverages', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc695c', storeName: 'Store 2' },
  // Dairy
  { name: 'Milk', price: 50, category: 'Dairy', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 1' },
  { name: 'Curd', price: 40, category: 'Dairy', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 2' },
  { name: 'Paneer', price: 90, category: 'Dairy', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 3' },
  { name: 'Butter', price: 120, category: 'Dairy', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', storeName: 'Store 1' },
  // Bakery
  { name: 'Bread', price: 30, category: 'Bakery', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 2' },
  { name: 'Bun', price: 20, category: 'Bakery', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 3' },
  { name: 'Cake', price: 150, category: 'Bakery', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', storeName: 'Store 1' },
  // Frozen
  { name: 'Frozen Peas', price: 60, category: 'Frozen', image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0', storeName: 'Store 2' },
  { name: 'Ice Cream', price: 80, category: 'Frozen', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 3' },
  // Condiments
  { name: 'Ketchup', price: 55, category: 'Condiments', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 1' },
  { name: 'Mayonnaise', price: 70, category: 'Condiments', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 2' },
  // Baby Care
  { name: 'Baby Powder', price: 90, category: 'Baby Care', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', storeName: 'Store 3' },
  { name: 'Diapers', price: 200, category: 'Baby Care', image: 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c1b9b', storeName: 'Store 1' },
  // Pet Supplies
  { name: 'Dog Food', price: 180, category: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc695c', storeName: 'Store 2' },
  { name: 'Cat Litter', price: 100, category: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', storeName: 'Store 3' },
  // Health
  { name: 'Paracetamol', price: 25, category: 'Health', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c', storeName: 'Store 1' },
  { name: 'Bandage', price: 15, category: 'Health', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 2' },
  // Stationery
  { name: 'Notebook', price: 40, category: 'Stationery', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 3' },
  { name: 'Pen', price: 10, category: 'Stationery', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 1' },
  // Cleaning
  { name: 'Detergent', price: 60, category: 'Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc695c', storeName: 'Store 2' },
  { name: 'Toilet Paper', price: 30, category: 'Cleaning', image: 'https://images.unsplash.com/photo-1588776814546-ec7e3b2c1b9b', storeName: 'Store 3' },
  // Personal Care
  { name: 'Face Wash', price: 90, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', storeName: 'Store 2' },
  { name: 'Moisturizer', price: 110, category: 'Personal Care', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', storeName: 'Store 3' },
  // Electronics
  { name: 'LED Bulb', price: 80, category: 'Electronics', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', storeName: 'Store 3' },
  { name: 'Extension Cord', price: 150, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', storeName: 'Store 1' },
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
  res.status(201).json({ message: 'Many demo items added!' });
}
