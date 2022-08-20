import Head from "next/head";

// import styles from "../styles/Home.module.css";
import Image from 'next/future/image'

export default function Home() {
  
  return (
   <>
    
    <div className=" relative pt-20 lg:pt-6 md:pt-8">
      {/* <Image src="/assets/ind.jpg" width={500} height={100}  className="w-auto h-1/2 "  />
       */}
      <Image src="/assets/indexx.png" 
      width={500} 
      height={100}  
      quality={100}
      style={{width:"100%",height:"auto"}}  />
     <input type="text" placeholder="Search" className="bg-white rounded-xl p-2 w-96 pl-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 outline-none " />
     <div className="text-center">
     <h1 className="font-bold text-3xl mt-4 text-orange-500">Our most popular foods.</h1>
     </div>
    </div></>
  );
}
