// scripts/seed-products.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/Product.js';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const products = [
  {
    name: 'Andhra Sona Masoori Rice (5kg)',
    price: 385,
    image: '/images/rice.jpg',
    category: 'Grains',
    location: 'Andhra Pradesh',
  },
  {
    name: 'Red Chilli Powder (Guntur) - 500g',
    price: 120,
    image: '/images/chilli.jpg',
    category: 'Spices',
    location: 'Andhra Pradesh',
  },
  {
    name: 'Toor Dal - 1kg',
    price: 135,
    image: '/images/toor-dal.jpg',
    category: 'Pulses',
    location: 'Andhra Pradesh',
  },
  {
    name: 'Natu Kodi Eggs (1 dozen)',
    price: 90,
    image: '/images/eggs.jpg',
    category: 'Dairy & Poultry',
    location: 'Andhra Pradesh',
  },
  {
    name: 'Groundnut Oil (1L)',
    price: 180,
    image: '/images/oil.jpg',
    category: 'Oils',
    location: 'Andhra Pradesh',
  },
  {
    name: 'Curry Leaves - 1 bunch',
    price: 10,
    image: '/images/curry-leaves.jpg',
    category: 'Vegetables',
    location: 'Andhra Pradesh',
  },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not defined in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing entries
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Seeded products successfully');
  } catch (err) {
    console.error('❌ Error seeding products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
