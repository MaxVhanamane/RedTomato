import Head from "next/head";
import React, { useState, useEffect } from "react";
import connectDb from './../middleware/mongoose';
import Food from './../models/foods';
import Link from 'next/link';
import Image from "next/image";
import dynamic from "next/dynamic";
import { RiSearchLine } from "react-icons/ri";
import { getFoodImage } from "../utils/imageHelper";

import PopularFoodItems from "../components/PopularFoodItems";

const SearchResults = dynamic(() => import("../components/SearchResults"), {
  ssr: true,
});

export default function Home({ foodItems, page, totalPages, totalItems }) {
  const [allTypesOfFood, setAllTypesOfFood] = useState(foodItems || []);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setshowSearch] = useState(false);

  useEffect(() => {
    setAllTypesOfFood(foodItems || []);
  }, [foodItems]);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setSearchResult([]);
      setshowSearch(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/getfooditems?search=${encodeURIComponent(searchTerm.trim())}&limit=20`);
        const data = await res.json();
        if (data.success && data.foods) {
          setSearchResult(data.foods);
        } else {
          setSearchResult([]);
        }
      } catch (err) {
        const fallback = allTypesOfFood.filter((val) =>
          val.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(fallback);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, allTypesOfFood]);

  function handleSearch(event) {
    const val = event.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setshowSearch(true);
    } else {
      setshowSearch(false);
    }
  }

  return (
    <>
      <Head>
        <title>Red Tomato - Home</title>
        <meta
          name="description"
          content="Get your favorite meals delivered to your door with our easy-to-use food delivery app. Choose from a wide range of veg and non-veg food items, enjoy contactless delivery. Order now and experience the convenience of food delivery at your fingertips"
        />
      </Head>
      <div className="relative pt-[4rem] sm:pt-[4.75rem] lg:pt-6 md:pt-8 text-gray-400 focus-within:text-gray-600">
        <div style={{ width: "100vw", height: "19vh", position: "relative" }} className="home_image">
          <Image
            src="/assets/small_screen_home.jpg"
            priority={true}
            alt="home image"
            layout="fill"
            objectFit="cover"
            className="small_screen"
          />
          <Image
            src="/assets/home5.jpg"
            priority={true}
            alt="home image"
            layout="fill"
            objectFit="cover"
            className="large_screen"
          />
        </div>

        <div className="flex items-center justify-center pt-16 lg:pt-6 md:pt-8 text-gray-400 w-full focus-within:text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <RiSearchLine className="hidden md:block w-4 h-4 sm:w-5 sm:h-5 z-20 fixed sm:-ml-[21rem] -ml-[11.5rem] pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            className="fixed border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 bg-white rounded-lg sm:p-2 sm:w-96 p-[0.1rem] sm:pl-[3rem] pl-[1rem] outline-none shadow-neutral-300"
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Search Results */}
      {showSearch ? (
        <SearchResults showSearch={showSearch} searchResult={searchResult} />
      ) : null}

      {/* Category Navigation Cards */}
      {!showSearch && (
        <div className="md:hidden w-screen flex justify-center items-center mt-[0.1rem] gap-[0.1rem]">
          <Link href="/veg">
            <div
              style={{ width: "100vw", height: "18vh", position: "relative", cursor: "pointer" }}
              className="shadow bg-gradient-to-r from-[#020b14] to-[#021e2a]"
            >
              <h2 className="absolute top-0 left-0 z-10 font-bold text-xs py-0.5 px-1 text-white md:text-2xl bg-green-700 md:px-2 md:py-1">
                Veg
              </h2>
              <Image src="/assets/veg.png" alt="veg food image" layout="fill" objectFit="cover" priority={true} />
            </div>
          </Link>
          <Link href="/nonveg">
            <div
              style={{ width: "100vw", height: "18vh", position: "relative", cursor: "pointer" }}
              className="shadow bg-gradient-to-r from-[#020b14] to-[#021e2a]"
            >
              <h2 className="absolute top-0 left-0 z-10 font-bold text-xs py-0.5 px-1 text-white md:text-2xl bg-red-600 md:px-2 md:py-1">
                Non Veg
              </h2>
              <Image src="/assets/nonveg.png" alt="non veg food image" layout="fill" objectFit="cover" priority={true} />
            </div>
          </Link>
        </div>
      )}

      {/* Dishes with 10 products per page */}
      <PopularFoodItems showSearch={showSearch} popularFoodItems={foodItems} />

      {/* Pagination Controls */}
      {!showSearch && totalPages > 1 && (
        <div className="flex justify-between items-center my-8 max-w-xl mx-auto px-4">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({totalItems} items)
          </p>
          <div className="flex space-x-2">
            {page > 1 ? (
              <Link href={`/?page=${page - 1}`}>
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
              <Link href={`/?page=${page + 1}`}>
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
    </>
  );
}

// Loads only 10 products per page
export async function getServerSideProps(context) {
  await connectDb();

  const page = Math.max(1, parseInt(context.query.page || '1', 10));
  const limit = 10;
  const totalItems = await Food.countDocuments({});
  const foods = await Food.find({})
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('title slug desc img price category popularity')
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
