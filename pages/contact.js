import React from 'react'
import { SiRottentomatoes } from "react-icons/si";
import Head from "next/head";



export default function Contact() {
    return (
    <>
    <Head>
    <title>Contact Us</title>
    <meta name="description" content="Red Tomatos contact us page" />
   </Head>
            <div className=" lg:pt-28  pt-[3.45rem] lg:mb-20">
                <div className="max-w-screen-xl md:pt-24 px-4 md:px-8 lg:px-12 xl:px-26 py-16 mx-auto bg-gray-100 text-gray-900 lg:rounded-lg shadow-lg">
                    <div className="flex flex-col justify-center items-center">
                        <div>
                            <h2 className="text-center text-3xl font-bold leading-tight">How can we help?</h2>
                            <div className=" flex items-center justify-center m-4">  <SiRottentomatoes className='text-red-600 text-8xl '/></div>
                          
                                <p className="text-center text-xl lg:text-2xl font-medium leading-tight">Feel free to ask us anything!</p>
                                <p className="py-4 px-4 text-md lg:text-md leading-tight text-center">If you have any questions regarding  your order, feel free to send email, call or Whatsapp us on our support number</p>
                                <div className="flex justify-center">
                                 
                                        <div className="text-center px-5 md:px-0 md:text-left py-10">
                                            <span className="flex justify-center mb-2 font-bold">Customer Support <br/></span>
                                            Call/Whatsapp: <a className="underline text-blue-600" rel="noreferrer" target="_blank" href="https://wa.me/8390008589?text=Hi,I need to enquire about">+91 8390008589</a>
                                            <br/>Email: maxvhanamane@gmail.com <br/> Support open: from 9AM - 7PM
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </>
                )
}
