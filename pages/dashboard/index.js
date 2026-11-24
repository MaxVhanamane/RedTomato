import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardSidebar from './../../components/DashboardSidebar';
import { getAuthenticatedUser } from '../../middleware/auth';
import { RiDashboardFill } from "react-icons/ri";

export default function Dashboard() {
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
        <title>Dashboard - RedTomato</title>
        <meta name="description" content="RedTomato Admin Dashboard" />
      </Head>
      <DashboardSidebar />
      <div className="lg:ml-60 sticky top-0 z-10">
        <div className="sticky top-0 py-3 font-bold md:text-3xl text-2xl bg-red-500 text-center shadow text-gray-50 drop-shadow mb-8 z-10">
          <RiDashboardFill className="absolute ml-4 text-4xl hidden lg:block" />
          <span className="absolute ml-16 text-lg text-center top-4 hidden lg:block">Dashboard</span>
          <h1 className="text-center mx-auto">Admin Dashboard</h1>
        </div>
      </div>
      <div className="lg:ml-60 p-6 flex justify-center items-center min-h-[50vh]">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-100 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to RedTomato Admin</h2>
          <p className="text-gray-600 mb-6">Manage all incoming orders, view listed food products, or add new items to the menu.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard/allorders">
              <a className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">View Orders</a>
            </Link>
            <Link href="/dashboard/viewall">
              <a className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition">Manage Menu</a>
            </Link>
          </div>
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
  return { props: {} };
}
