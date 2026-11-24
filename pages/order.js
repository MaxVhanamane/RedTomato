import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Error from 'next/error';
import connectDb from './../middleware/mongoose';
import Order from './../models/orders';
import { getAuthenticatedUser } from '../middleware/auth';
import { getFoodImage, handleImageError } from '../utils/imageHelper';

export default function MyOrder({ order, error }) {
  if (error || !order) {
    return <Error statusCode={error || 404} title="Order not found" />;
  }

  const products = order.products || {};

  return (
    <>
      <Head>
        <title>Order #{order.orderId} - RedTomato</title>
        <meta name="description" content={`Order details for #${order.orderId}`} />
      </Head>
      <section className="text-gray-600 body-font overflow-hidden pt-20 pb-16">
        <div className="container px-5 mx-auto max-w-4xl">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
            {/* Order Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">Order Summary</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                Order #{order.orderId}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  Payment: {order.status.toUpperCase()}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Delivery: {order.deliveryStatus || 'Unshipped'}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Delivery Details</h2>
              <p className="text-sm text-gray-600 font-medium">{order.name}</p>
              <p className="text-sm text-gray-500">{order.address}{order.area ? `, ${order.area}` : ''}, {order.city}, {order.state} - {order.pin}</p>
              <p className="text-sm text-gray-500 mt-1">Phone: {order.phone} | Email: {order.email}</p>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(products).map((key) => {
                    const item = products[key];
                    return (
                      <tr key={key}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center space-x-3">
                          {item.img && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                              <Image
                                src={getFoodImage(item.img, '/assets/tomato.png')}
                                alt={key}
                                layout="fill"
                                objectFit="cover"
                                onError={(e) => handleImageError(e, '/assets/tomato.png')}
                              />
                            </div>
                          )}
                          <span>{key}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center capitalize">{item.size || 'Regular'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.qty}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-right">₹{item.price}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">₹{item.price * item.qty}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <Link href="/orders">
                <a className="text-sm text-red-600 hover:text-red-700 font-medium">← Back to My Orders</a>
              </Link>
              <div className="text-right">
                <span className="text-sm text-gray-500 mr-2">Total Amount Paid:</span>
                <span className="text-2xl font-bold text-red-600">₹{order.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const user = getAuthenticatedUser(context.req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  await connectDb();

  const orderId = context.query.id;
  if (!orderId) {
    return { props: { error: 404 } };
  }

  const order = await Order.findOne({ orderId }).lean();
  if (!order) {
    return { props: { error: 404 } };
  }

  // Authorization check: Only order owner or admin can view order
  if (user.role !== 'admin' && order.email !== user.email) {
    return {
      redirect: {
        destination: '/orders',
        permanent: false,
      },
    };
  }

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}
