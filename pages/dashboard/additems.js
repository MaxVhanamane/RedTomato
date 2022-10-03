import React,{useState,useEffect} from 'react'
import { useRef } from 'react';
import DashboardSidebar from './../../components/DashboardSidebar';

import { storage } from '../../components/firebase';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"
import {  toast } from 'react-toastify';
import { useRouter } from 'next/router';


export default function Additems() {
const [uploading,setUploading]=useState(false)
const [foodItem,setFoodItem]=useState({
    
        title: "",
        slug: "",
        desc: "",
        popularity:"",
        category: "",
        price: "",
        img:"",
        availableQty: "",
      
})


const uRef=useRef()

// const [fileLocation,setFileLocation]=useState(null)
// const [imageUpload,setImageUpload]=useState(null)
//  const [imageUrlLink,setImageUrlLink]=useState(null)
const [imageInfo,setImageInfo]=useState({
    imageUpload:"",
    fileLocation:""

})

const router=useRouter()
useEffect(()=>{
  const fetchUser= async ()=>{
   const res=await fetch( `${process.env.NEXT_PUBLIC_HOST}/api/getuserdetails`, {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({tokenVal:localStorage.getItem("token")}),
        })

        const finalRes = await res.json()
        if( !(finalRes.success && finalRes.role==="admin")){
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          router.push("/")
        }
        
      
  }
  let adminToken=localStorage.getItem("token")
  let role=localStorage.getItem("role")

  if(!(adminToken && role==="admin"))
  {
    router.push("/")
  }
  else{
    fetchUser()
  }
 

},[router.query])


const handleFirebaseFileLocation=(e)=>{
    // setFileLocation(e.target.value)
    setImageInfo({
        ...imageInfo,
        fileLocation:e.target.value
    })
}

const handleChange=(e)=>{
    if(e.target.name==="title"){
        setFoodItem({
               ...foodItem  ,
               title:e.target.value 
        })
    }

    else if(e.target.name==="slug"){
        setFoodItem({
            ...foodItem  ,
            slug:e.target.value 
     })
    }

    else if(e.target.name==="desc"){
 setFoodItem({
               ...foodItem  ,
               desc:e.target.value 
        })
    }

    else if(e.target.name==="img"){
 setFoodItem({
               ...foodItem  ,
               img:e.target.value 
        })
    }

    else if(e.target.name==="category"){
 setFoodItem({
               ...foodItem  ,
               category:e.target.value 
        })
    }

    else if(e.target.name==="popularity"){
 setFoodItem({
               ...foodItem,
               popularity:e.target.value 
        })
    }

    else if(e.target.name==="availableQty"){
 setFoodItem({
               ...foodItem  ,
               availableQty:e.target.value 
        })
    }

    else if(e.target.name==="price"){
       
 setFoodItem({
               ...foodItem  ,
               price:e.target.value 
        })
    }
}



 // Getting the information of the file that user has selected
    let handleFileChange=(e)=>{
        // setImageUpload(e.target.files[0])
        setImageInfo({...imageInfo,
        imageUpload:e.target.files[0]
        })
        
    }

// Uploading image to firebase and getting back url of that image.
    let handleUpload=()=>{
// If no file is selected then we will do nothing.
    if(imageInfo.imageUpload==null) return;
    if(imageInfo.fileLocation==="veg"){

        const imageRef=ref(storage,`veg/${imageInfo.imageUpload.name}`)
        uploadImageToFirebase(imageRef)
    }
    else if( imageInfo.fileLocation==="nonveg"){
        const imageRef=ref(storage,`nonveg/${imageInfo.imageUpload.name}`)
        uploadImageToFirebase(imageRef)

    }
    else{
        toast.error('Please select file location to upload an image', {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    }

function uploadImageToFirebase(imageRef){
    setUploading(true)
    uploadBytes(imageRef,imageInfo.imageUpload).then((e)=>{
    
        getDownloadURL(e.ref).then((url)=>{
        // 

           setFoodItem({
            ...foodItem,
            img:url
           })

           setUploading(false)
    

       })
           toast.success('Image uploaded successfully!', {
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
             });
            
        })
        uRef.current.value=""
        setImageInfo({
            ...imageInfo,
            fileLocation:""

        })
       
       
}
   

 
    }

 const handleAdd=async()=>{
    const data = [{title:foodItem.title,slug:foodItem.slug,desc:foodItem.desc,popularity:foodItem.popularity,category:foodItem.category,price:JSON.parse(foodItem.price),img:foodItem.img,availableQty:foodItem.availableQty}];
     

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addfooditems`, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const response = await res.json()
    if(response.success){
        toast.success('Item added successfully!', {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

setFoodItem({
    ...foodItem,
    title: "",
    slug: "",
    desc: "",
    popularity:"",
    category: "",
    price: "",
    img:"",
    availableQty: ""
})

    }

    }

  return (
    <>
    <style jsx global>{`
       footer{
        display:none;
       }
       #nav{
        display:none;
       }
      `}</style>
    <DashboardSidebar/>
    <div className="lg:ml-60 sticky top-0 bg-[#f9fafb] z-10">
    <div className="  py-4 font-bold md:text-3xl text-2xl  mx-auto text-center shadow  text-gray-700 drop-shadow mb-8 "><h1 className="text-center mx-auto">Add a food item</h1></div></div>
    <div className='lg:ml-28 p-6  pt-6 flex justify-center w-full'>
    
    <div className="block p-6 rounded-lg shadow-lg bg-white w-[50rem]  mb-28">
        
      <div className="form-group mb-6">
        <label htmlFor="title"  className="formLabel inline-block mb-2 text-gray-700">Title</label>
        <input onChange={handleChange} value={foodItem.title} name="title" type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="title"
          aria-describedby="emailHelp" placeholder="Enter title"/>
      </div>
      
     
      <div className="form-group mb-6">
        <label htmlFor="slug"  className="formLabel inline-block mb-2 text-gray-700">Slug</label>
        <input onChange={handleChange} name="slug"  value={foodItem.slug} type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="slug"
          aria-describedby="emailHelp" placeholder="Enter unique slug"/>
      </div>
      
     
      <div className="form-group mb-6">
        <label htmlFor="description"  className="formLabel inline-block mb-2 text-gray-700">Description</label>
        <input onChange={handleChange} name="desc" value={foodItem.desc} type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="description"
          aria-describedby="emailHelp" placeholder="Enter description"/>
      </div>
      
     
     
   
      
      <div className="relative w-full lg:max-w-sm mb-6">
      <label htmlFor="category"  className="formLabel inline-block mb-2 text-gray-700">Select food Category</label>

            <select name="category" id="category" className="w-full p-2.5  text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600" onChange={handleChange} value={foodItem.category?foodItem.category:"selectcategory"} >
                <option  value={"selectcategory"} disabled>Select food Category</option>
                <option>veg</option>
                <option>nonveg</option>
            </select>
        </div>

      <div className="relative w-full lg:max-w-sm mb-6">
      <label htmlFor="popularity"  className="formLabel inline-block mb-2 text-gray-700">Select Popularity</label>

            <select  name="popularity" id="popularity" onChange={handleChange} className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600" value={foodItem.popularity?foodItem.popularity:"selectpopularity"}  >
                <option  value={"selectpopularity"} disabled >Select Popularity</option>
                <option >high</option>
                <option >low</option>
            </select>
        </div>
     
   
{/* Upload image to firebase  */}




<div className="mb-6 flex " >
    <div className="form-group mb-6  ">
        <p className="formLabel inline-block mb-4  text-gray-700">Upload Image</p>

        <div className="relative w-full lg:max-w-sm mb-6">
      <label htmlFor="filelocation"  className="formLabel inline-block mb-2 text-gray-700">Select the name of the directory where you want to store the image in firebase</label>

            <select name="filelocation" id="filelocation" className="w-full p-2.5  text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600" onChange={handleFirebaseFileLocation} value={imageInfo.fileLocation?imageInfo.fileLocation:"selectfilelocation"} >
                <option  value={"selectfilelocation"} disabled>Select File Location</option>
                <option>veg</option>
                <option>nonveg</option>
            </select>
        </div>
      <p  className={`hover:text-gray-700 mb-3  ${uploading===false ? "hidden": "text-blue-700 animate-pulse"} `}> Uploading please wait...</p>
        <input ref={uRef} onChange={handleFileChange}   name="file" type="file" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="file"
          aria-describedby="emailHelp" />

<button onClick={handleUpload} type="submit"  className="
mt-8
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-blue-700 hover:shadow-lg
        focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-blue-800 active:shadow-lg
        transition
        duration-150
        ease-in-out">Upload</button>
      </div>

      
      </div>


      
     
      <div className="form-group mb-6">
        <label htmlFor="image" className="formLabel inline-block mb-2 text-gray-700">Image (will automatically select once you upload an image)</label>
        <input readOnly  name="img" value={foodItem.img} type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="image"
          aria-describedby="emailHelp" placeholder="Enter image path"/>
      </div>
      
     
      <div className="form-group mb-6">
        <label htmlFor="qty"   className="formLabel inline-block mb-2 text-gray-700">Available Quantity</label>
        <input onChange={handleChange} value={foodItem.availableQty} name="availableQty" type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="qty"
          aria-describedby="emailHelp" placeholder="Enter quantity"/>
      </div>
      
     
      <div className="form-group mb-6">
        <label htmlFor="price"  className="formLabel inline-block mb-2 text-gray-700">Price (format [44,55,88])</label>
        <input onChange={handleChange} value={foodItem.price} name="price" type="text" className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="price"
          aria-describedby="emailHelp" placeholder="Enter array of three numbers/prices eg. [ 20, 56 ,88 ]"/>
      </div>
      
    
     
      <button onClick={handleAdd} type="submit" className="
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-blue-700 hover:shadow-lg
        focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-blue-800 active:shadow-lg
        transition
        duration-150
        ease-in-out">Add</button>



  </div></div></>
  )
}


