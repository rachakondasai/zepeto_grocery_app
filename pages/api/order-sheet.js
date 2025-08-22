import dbConnect from '../../lib/dbConnect';
import Order from '../../models/Order';
import Item from '../../models/Item';
import Store from '../../models/Store';
import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  await dbConnect();
  const { orderId } = req.query;
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  if (!orderId) return res.status(400).json({ message: 'Missing orderId' });
  const order = await Order.findById(orderId).populate('user', 'email').populate('store', 'name address').populate('items.item', 'name price');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=order-sheet-${orderId}.pdf`);
  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text('Order Sheet', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Store: ${order.store.name}`);
  doc.text(`Store Address: ${order.store.address || ''}`);
  doc.text(`Customer: ${order.user.email}`);
  doc.text(`Delivery Address: ${order.address}`);
  doc.text(`Order Status: ${order.status}`);
  doc.moveDown();
  doc.fontSize(16).text('Items:');
  order.items.forEach(i => {
    doc.fontSize(14).text(`${i.item.name} x ${i.quantity} @ $${i.item.price}`);
  });
  doc.end();
}
