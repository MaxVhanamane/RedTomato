import React from "react";
import Head from "next/head";
import { SiRottentomatoes } from "react-icons/si";
import Link from "next/link"
export default function About() {
  return <>   
  <Head>
  <title>About Us</title>
  <meta name="description" content="Red tomato is a food delivery app. We deliver veg and nonveg food at a good and reasonable price" />

 </Head>

 <div className=" lg:pt-28  pt-[3.45rem] lg:mb-20">
                <div className="max-w-screen-xl md:pt-24 px-4 md:px-8 lg:px-12 xl:px-26 py-16 mx-auto bg-gray-100 text-gray-900 lg:rounded-lg shadow-lg">
                    <div className="flex flex-col justify-center items-center">
                        <div>
                            <h2 className="text-center text-3xl font-bold leading-tight">About Us</h2>
                            <div className=" flex items-center justify-center m-4">  <SiRottentomatoes className='text-red-600 text-8xl '/></div>
                                <p className="pt-4 px-4 text-md lg:text-md leading-tight text-center">We have developed this website to deliver delicious food at a good and reasonable price.</p>
                          
                                <p className="py-4 lg:px-56 md:px-12 text-md lg:text-md leading-tight text-center">If you are wondering why you should order from RedTomato when there are multiple options available to you, our unique flavor of food and quality will answer your question. So what are you waiting for?</p>
                                          <div className="mx-auto text-center">
                               <Link href="/"><button className="mt-2 inline-block px-6 py-2 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Order Now</button></Link>
                            </div>
                                <div className="flex justify-center">
                                 
                                        <div className="text-center px-5 md:px-0 md:text-left py-10">
                                            <span className="flex justify-center mb-2 font-bold">Customer Support <br/></span>
                                            Call/Whatsapp: <a className="underline text-blue-600" rel="noreferrer" target="_blank" href="https://wa.me/918390008589?text=Hi,I need to enquire about">+91 839 000 8589</a>
                                            <br/>Email: maxvhanamane@gmail.com <br/> Support open: from 9AM - 7PM
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
 
 </>;
}
