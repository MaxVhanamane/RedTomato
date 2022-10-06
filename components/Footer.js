import React from 'react'
import { SiRottentomatoes } from "react-icons/si";
import { RiTwitterFill } from "react-icons/ri";
import { RiLinkedinFill } from "react-icons/ri";
import { FiInstagram } from "react-icons/fi";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-600 body-font mt-10 sticky top-full ">
    <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
      <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
        <Link href="/"><a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
          <SiRottentomatoes className="text-3xl text-red-600"/>
          <span className="ml-3 text-xl text-red-500">RedTomato</span>
        </a></Link>
        <p className="mt-4 text-sm text-gray-500 ml-2"> It is fast, fresh and delicious! <br/>We cook, you enjoy at home.</p>
      </div>
      <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
          <nav className="list-none mb-10">
            <ul>
            <li >
            <Link href="/veg">
              <a className="text-gray-500 hover:text-gray-700 active:text-red-500 ">
                Veg
              </a>
            </Link>
            </li>
            <li>
            <Link href="/nonveg">
              <a className="text-gray-500 hover:text-gray-700 active:text-red-500 ">
                Non veg
              </a>
            </Link>
            </li>
            </ul>
          </nav>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CUSTOMER SERVICE</h2>
          <nav className="list-none mb-10">
            <ul>
            <li>
            <Link href="/about">
              <a className="text-gray-500 hover:text-gray-700 active:text-red-500 ">
                About us
              </a>
            </Link>
            </li>
            <li>
            <Link href="/contact">
              <a className="text-gray-500 hover:text-gray-700 active:text-red-500 ">
                Contact us
              </a>
            </Link>
            </li>
            </ul>
          </nav>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SOCIAL LINKS</h2>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <Link href="https://twitter.com/Maxvhanamane">
          <a className="ml-3 text-gray-500 cursor-pointer" target="_blank" aria-label="Twitter">
          <RiTwitterFill />

          </a>
          </Link>
          <Link href="https://www.instagram.com/oreo_max_8.0.0.8/">
          <a className="ml-3 text-gray-500 cursor-pointer" 
              target="__blank" aria-label="instagram">
          <FiInstagram />
          </a>
          </Link>
          <Link href="https://www.linkedin.com/in/max-vhanamane/">
          <a className="ml-3 text-gray-500 cursor-pointer" target="_blanK" aria-label="LinkedIn" >
          <RiLinkedinFill/>
          </a>
          </Link>
        </span>
        </div>
      
      
        
      </div>
    </div>
    <div className="bg-gray-200 pb-20 md:pb-0  lg:mb-0">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-500 text-sm text-center sm:text-left">© {new Date().getFullYear()}  Redtomato — All rights reserved.
        </p>
        
      </div>
    </div>
  </footer>
  )
}
