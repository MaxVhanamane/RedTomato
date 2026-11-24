import React, { useState, useEffect } from "react";
import Image from "next/image";
import connectDb from './../../middleware/mongoose';
import Food from './../../models/foods';
import Link from 'next/link';
import DashboardSidebar from './../../components/DashboardSidebar';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from "next/head";
import { RiDashboardFill } from "react-icons/ri";
import { getAuthenticatedUser } from '../../middleware/auth';
import { getFoodImage, handleImageError } from '../../utils/imageHelper';

export default function Viewall({ foodItems, page, totalPages, totalItems }) {
  const router = useRouter();

  const myLoader = ({ src }) => {
    return src || '/assets/tomato.png';
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/deletefooditem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const response = await res.json();
      if (response.success) {
        toast.success('Item deleted successfully!', {
          autoClose: 2000,
        });
        refreshData();
      } else {
        toast.error(response.error || 'Failed to delete item');
      }
    } catch (e) {
      toast.error('An error occurred while deleting');
    }
  };

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
        <title>Dashboard - View All Products</title>
        <meta name="description" content="View all the products listed on Red Tomato site" />
      </Head>
      <DashboardSidebar />
      <section className="text-gray-600 body-font lg:ml-60">
        <div className="sticky top-0 py-3 font-bold bg-red-500 text-center shadow text-gray-50 drop-shadow mb-8 z-10">
          <RiDashboardFill className="absolute ml-4 text-4xl hidden lg:block" />
          <span className="absolute ml-16 text-lg text-center top-4 hidden lg:block">Dashboard</span>
          <h1 className="text-center w-full mx-auto md:text-3xl text-2xl">All Food Items</h1>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap m-auto justify-center gap-4">
            {foodItems && foodItems.length > 0 ? (
              foodItems.map((item) => (
                <div key={item._id} className="mt-3 mb-8 w-80 hover:shadow-xl hover:bg-gray-50 border border-gray-100 rounded-xl p-3 transition duration-200">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      loader={myLoader}
                      alt={item.title || 'Food item'}
                      src={getFoodImage(item.img, item.category === 'veg' ? '/assets/veg.png' : '/assets/nonveg.png')}
                      layout="fill"
                      objectFit="cover"
                      onError={(e) => handleImageError(e, item.category === 'veg' ? '/assets/veg.png' : '/assets/nonveg.png')}
                    />
                  </div>

                  <div className="mt-3">
                    <h2 className="text-gray-900 title-font text-lg font-semibold truncate">
                      {item.title}
                    </h2>
                    <p className="text-gray-500 text-xs tracking-widest title-font mb-1 h-8 overflow-hidden">
                      {item.desc ? `${item.desc.slice(0, 80)}...` : ''}
                    </p>
                    <div className="text-xs text-gray-400 mb-2">
                      Qty: <span className="font-semibold text-gray-700">{item.availableQty}</span> | Category: <span className="capitalize font-semibold text-gray-700">{item.category}</span>
                    </div>
                    <hr className="block bg-gray-200 h-0.5 my-2" />
                    <div className="flex items-center justify-between mt-3">
                      <p className="font-bold text-gray-900 text-lg">₹{item.price?.[0]}</p>
                      <div className="flex space-x-2">
                        <Link passHref href={`/dashboard/edititem/${item.slug}`}>
                          <a className="text-white bg-green-700 hover:bg-green-800 text-sm font-medium px-4 py-1.5 rounded-md transition">
                            Edit
                          </a>
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("Do you really want to delete this item?")) {
                              handleDelete(item._id);
                            }
                          }}
                          className="text-white bg-red-500 hover:bg-red-600 text-sm font-medium px-4 py-1.5 rounded-md transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-gray-500">No food items found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center my-8 max-w-2xl mx-auto px-4">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({totalItems} items total)
              </p>
              <div className="flex space-x-2">
                {page > 1 ? (
                  <Link href={`/dashboard/viewall?page=${page - 1}`}>
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
                  <Link href={`/dashboard/viewall?page=${page + 1}`}>
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
      </section>
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
  const limit = 12;
  const totalItems = await Food.countDocuments({});
  const foods = await Food.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const sanitizedFoods = foods.map((f) => ({
    ...f,
    img: getFoodImage(f.img, f.category === 'veg' ? '/assets/veg.png' : '/assets/nonveg.png'),
  }));

  return {
    props: {
      foodItems: JSON.parse(JSON.stringify(sanitizedFoods)),
      page,
      totalPages: Math.ceil(totalItems / limit) || 1,
      totalItems,
    },
  };
}
