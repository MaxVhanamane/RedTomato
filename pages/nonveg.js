import React from "react";
import Image from "next/image";
import connectDb from './../middleware/mongoose';
import Food from './../models/foods';
import Link from 'next/link';
import Head from "next/head";
import { getFoodImage, handleImageError } from '../utils/imageHelper';

export default function NonVeg({ foodItems, page, totalPages, totalItems }) {
  const myLoader = ({ src }) => {
    return src || '/assets/nonveg.png';
  };

  return (
    <>
      <Head>
        <title>Red Tomato - Non-Veg Menu</title>
        <meta name="description" content="Explore delicious non-vegetarian dishes available on Red Tomato" />
      </Head>
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-16 pb-20 mx-auto">
          <h1 className="font-bold md:text-3xl text-2xl text-center mb-6 text-gray-700 lg:mt-6 mt-4 drop-shadow">
            <span className="px-6">Non-Veg Food Items</span>
          </h1>

          <div className="flex flex-wrap m-auto justify-center gap-4">
            {foodItems && foodItems.length > 0 ? (
              foodItems.map((item) => (
                <div key={item._id} className="mt-3 mb-6 w-80 hover:shadow-xl hover:bg-gray-50 border border-gray-100 rounded-xl p-3 transition duration-200 antialiased">
                  <Link passHref href={`/product/${item.slug}`}>
                    <a className="block relative rounded-xl overflow-hidden">
                      <div className="relative w-full h-52 rounded-xl overflow-hidden">
                        <Image
                          className="rounded-xl"
                          loader={myLoader}
                          alt={item.title || 'Non-veg dish'}
                          src={getFoodImage(item.img, '/assets/nonveg.png')}
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => handleImageError(e, '/assets/nonveg.png')}
                        />
                      </div>

                      <div className="mt-3">
                        <h2 className="text-gray-900 title-font text-lg font-semibold truncate">
                          {item.title}
                        </h2>
                        <p className="text-gray-500 text-xs tracking-widest title-font mb-1 h-8 overflow-hidden">
                          {item.desc ? `${item.desc.slice(0, 80)}...` : ''}
                        </p>
                        <hr className="block bg-gray-200 h-0.5 my-2" />
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-bold text-gray-900 text-lg">₹{item.price?.[0]}</p>
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium">Non-Veg</span>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-gray-500">No non-vegetarian dishes found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center my-8 max-w-xl mx-auto px-4">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({totalItems} items)
              </p>
              <div className="flex space-x-2">
                {page > 1 ? (
                  <Link href={`/nonveg?page=${page - 1}`}>
                    <a className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium">
                      Previous
                    </a>
                  </Link>
                ) : (
                  <button disabled className="px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-md cursor-not-allowed">
                    Previous
                  </button>
                )}

                {page < totalPages ? (
                  <Link href={`/nonveg?page=${page + 1}`}>
                    <a className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md font-medium">
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
  await connectDb();

  const page = Math.max(1, parseInt(context.query.page || '1', 10));
  const limit = 8;
  const totalItems = await Food.countDocuments({ category: 'nonveg' });
  const foods = await Food.find({ category: 'nonveg' })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const sanitizedFoods = foods.map((f) => ({
    ...f,
    img: getFoodImage(f.img, '/assets/nonveg.png'),
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
