import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Order from './../models/orders';
import connectDb from './../middleware/mongoose';
import { getAuthenticatedUser } from '../middleware/auth';

export default function Orders({ myOrders, page, totalPages, totalOrders }) {
  return (
    <>
      <Head>
        <title>My Orders - RedTomato</title>
        <meta name="description" content="Orders page" />
      </Head>
      <div className="container pt-24 mb-24 px-4 mx-auto max-w-5xl">
        <h1 className="text-center font-bold text-gray-700 text-2xl mb-4">My Orders</h1>
        <div className="flex flex-col">
          {myOrders && myOrders.length > 0 ? (
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Order Id
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Food Items
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Order Date
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Total
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {myOrders.map((item) => {
                        const foods = item.products ? Object.keys(item.products) : [];
                        let foodItemsToDisplay = 'No items';
                        if (foods.length === 1) {
                          foodItemsToDisplay = foods[0];
                        } else if (foods.length > 1) {
                          foodItemsToDisplay = `${foods[0]}, ${foods[1]}${foods.length > 2 ? ', etc.' : ''}`;
                        }
                        return (
                          <tr key={item._id} className="bg-white transition duration-200 hover:bg-gray-50">
                            <td className="text-sm text-gray-900 font-mono px-6 py-4 whitespace-nowrap">
                              {item.orderId}
                            </td>
                            <td className="text-sm text-gray-700 px-6 py-4 whitespace-nowrap">
                              {foodItemsToDisplay}
                            </td>
                            <td className="text-sm text-gray-600 px-6 py-4 whitespace-nowrap">
                              {new Date(item.createdAt).toLocaleDateString('en-GB')}
                            </td>
                            <td className="text-sm font-semibold text-gray-900 px-6 py-4 whitespace-nowrap">
                              ₹{item.amount}
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-nowrap">
                              <Link href={`/order?id=${item.orderId}`}>
                                <a className="text-red-600 hover:text-red-700 font-medium">View Details</a>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6 px-2">
                    <p className="text-sm text-gray-600">
                      Showing page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({totalOrders} orders total)
                    </p>
                    <div className="flex space-x-2">
                      {page > 1 ? (
                        <Link href={`/orders?page=${page - 1}`}>
                          <a className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md">
                            Previous
                          </a>
                        </Link>
                      ) : (
                        <button disabled className="px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
                          Previous
                        </button>
                      )}

                      {page < totalPages ? (
                        <Link href={`/orders?page=${page + 1}`}>
                          <a className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md">
                            Next
                          </a>
                        </Link>
                      ) : (
                        <button disabled className="px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-red-500 text-xl font-medium mb-2">No paid orders found!</h3>
              <p className="text-gray-500 mb-6">Looks like you haven&apos;t ordered any delicious meals yet.</p>
              <Link href="/">
                <a className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">
                  Browse Menu
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
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

  const page = Math.max(1, parseInt(context.query.page || '1', 10));
  const limit = 10;
  const totalOrders = await Order.countDocuments({ email: user.email, status: 'paid' });
  const orders = await Order.find({ email: user.email, status: 'paid' })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    props: {
      myOrders: JSON.parse(JSON.stringify(orders)),
      page,
      totalPages: Math.ceil(totalOrders / limit) || 1,
      totalOrders,
    },
  };
}
