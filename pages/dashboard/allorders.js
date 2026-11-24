import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Orders from '../../models/orders';
import connectDb from './../../middleware/mongoose';
import DashboardSidebar from './../../components/DashboardSidebar';
import { RiDashboardFill } from 'react-icons/ri';
import { getAuthenticatedUser } from '../../middleware/auth';

export default function AllOrders({ allOrders, page, totalPages, totalOrders }) {
  const router = useRouter();
  const [orders, setOrders] = useState(allOrders || []);

  useEffect(() => {
    setOrders(allOrders || []);
  }, [allOrders]);

  return (
    <>
      <style jsx global>{`
        footer {
          display: none;
        }
        #nav {
          display: none;
        }
      `}</style>
      <Head>
        <title>Dashboard - All Orders</title>
        <meta name="description" content="View all the orders received" />
      </Head>
      <DashboardSidebar />

      <div className="lg:ml-60 sticky top-0 z-10">
        <div className="sticky top-0 py-3 font-bold md:text-3xl text-2xl bg-red-500 text-center shadow text-gray-50 drop-shadow mb-8 z-10">
          <RiDashboardFill className="absolute ml-4 text-4xl hidden lg:block" />{' '}
          <span className="absolute ml-16 text-lg text-center top-4 hidden lg:block">Dashboard</span>
          <h1 className="text-center mx-auto">All Orders</h1>
        </div>
      </div>

      <div className="lg:pt-2 pt-8 mb-24 lg:ml-60 p-4">
        <div className="flex flex-col lg:mx-8">
          {orders.length > 0 ? (
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Order Id
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Status
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Amount
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Date
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Name
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Email
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Phone
                        </th>
                        <th scope="col" className="text-sm font-semibold text-gray-700 px-6 py-4 text-left">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {orders.map((item) => (
                        <tr key={item._id} className="transition duration-150 hover:bg-gray-50">
                          <td className="text-sm text-gray-900 font-mono px-6 py-4 whitespace-nowrap">
                            {item.orderId}
                          </td>
                          <td className="text-sm px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="text-sm text-gray-900 font-semibold px-6 py-4 whitespace-nowrap">
                            ₹{item.amount}
                          </td>
                          <td className="text-sm text-gray-600 px-6 py-4 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString('en-GB')}
                          </td>
                          <td className="text-sm text-gray-800 px-6 py-4 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="text-sm text-gray-600 px-6 py-4 whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="text-sm text-gray-600 px-6 py-4 whitespace-nowrap">
                            {item.phone}
                          </td>
                          <td className="text-sm px-6 py-4 whitespace-nowrap">
                            <Link href={`/order?id=${item.orderId}`}>
                              <a className="text-blue-600 hover:text-blue-800 font-medium">View Details</a>
                            </Link>
                          </td>
                        </tr>
                      ))}
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
                        <Link href={`/dashboard/allorders?page=${page - 1}`}>
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
                        <Link href={`/dashboard/allorders?page=${page + 1}`}>
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
            <h1 className="text-center mt-6 text-md sm:text-xl text-gray-500">No orders found!</h1>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const user = getAuthenticatedUser(context.req);
  if (!user || user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  await connectDb();

  const page = Math.max(1, parseInt(context.query.page || '1', 10));
  const limit = 15;
  const totalOrders = await Orders.countDocuments({ status: 'paid' });
  const orders = await Orders.find({ status: 'paid' })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    props: {
      allOrders: JSON.parse(JSON.stringify(orders)),
      page,
      totalPages: Math.ceil(totalOrders / limit) || 1,
      totalOrders,
    },
  };
}
