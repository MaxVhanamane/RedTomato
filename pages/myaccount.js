import React,{useEffect,useContext,useState} from 'react'
import { useRouter } from 'next/router';
import { CartContext } from "./../context/CartState";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Orders() {
  const router=useRouter()
  // const {token}=useContext(CartContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [area, setArea] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [user, setUser] = useState("")
 const [tokenVal,setTokenVal]=useState("")
  const [pin, setPin] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [cNewPassword, setCNewPassword] = useState("")

  useEffect(()=>{
   let myUser= localStorage.getItem("user")
   let token= localStorage.getItem("token")
    if(!myUser){
     router.push("/")
    }
    if(myUser && token){
      setEmail(myUser)
      setUser(myUser)
      setTokenVal(token)
      fetchUserDetails(token)
    }
     },[])

     const handleChange = (e) => {
      if (e.target.name === "name") {
        setName(e.target.value)
      }
      else if (e.target.name === "email") {
        setEmail(e.target.value)
      }
      else if (e.target.name === "phone") {
        setPhone(e.target.value)
      }
      else if (e.target.name === "address") {
        setAddress(e.target.value)
      }
      else if (e.target.name === "pin") {
        setPin(e.target.value)
  
  
      }
      else if (e.target.name === "state") {
        setState(e.target.value)
  
  
      }
      else if (e.target.name === "city") {
        setCity(e.target.value)
  
  
      }
      else if (e.target.name === "area") {
        setArea(e.target.value)
  
  
      }
      else if (e.target.name === "password") {
        setPassword(e.target.value)
  
  
      }
      else if (e.target.name === "newpassword") {
        setNewPassword(e.target.value)
  
  
      }
      else if (e.target.name === "cnewpassword") {
        setCNewPassword(e.target.value)
  
  
      }
  
  
  
    }

    const fetchUserDetails=async(tokenVal)=>{
      const data = {tokenVal };
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuserdetails`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const response = await res.json()
      // checking if the response has undefined properties if I directly set them without checking then console will show a warning.
      // A component is changing a controlled input to be uncontrolled. 
      if(response.name != undefined){

        setName(response.name)
      }
      if(response.address != undefined){

        setAddress(response.address)
      }
      if(response.pin != undefined){

        setPin(response.pin)
      }
      if(response.city != undefined){

        setCity(response.city)
      }
     
      if(response.state != undefined){

        setState(response.state)
      }
      if(response.area != undefined){

        setArea(response.area)
      }
      if(response.phone != undefined){

        setPhone(response.phone)
      }
     
    }

    const handleUpdateUserDetails=async()=>{
      const data = {tokenVal,name,address,pin,city,state,area,phone };
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuserdetails`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const response = await res.json()
      if(response.success===true){
        toast.success("Your delivery details has been successfully updated", {
        
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else{
        toast.error(response.message, {
       
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

    const handleUpdatePassword=async()=>{
      if(newPassword===cNewPassword ){
        const data = {tokenVal,password,newPassword };
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        const response = await res.json()
        if(response.success===true){
          toast.success("Your password has been successfully updated", {
         
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        else{
          toast.error(response.message, {
         
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
      else{
        toast.error("New password and Confirm new password didn't match.", {
      
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      }
      
    }
  return (
    <div className="container pt-28 md:pt-20 ">
     
      <h1 className="text-xl text-center font-bold">Your account</h1>
      <div className='flex md:flex-row flex-col mb-10'>
      <div className="md:w-1/2 w-3/4 md:ml-28  m-auto mt-10  ">
        <h2 className="font-bold ">1. Delivery Details</h2>
        <div className=" mt-6 ">


          <label htmlFor="name" className=" mt-6">Name</label>
          <input type="text" name="name" onChange={handleChange} value={name} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          <label htmlFor="mail" className="block  mt-4">Email address (can't be changed)</label>
          <input type="mail" name="email" onChange={handleChange} value={email} readOnly className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          <label htmlFor="phone" className="block  mt-4">Phone</label>
          <input maxLength={10} type="text" name="phone" onChange={handleChange} value={phone} placeholder="Enter your 10 digit phone number" required className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

          <label htmlFor="address" className="block  mt-4">Address</label>
          <textarea type="text" name="address" onChange={handleChange} value={address} className="block md:w-9/12 w-full  mr-8 mt-2
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
       resize-none
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

          <label htmlFor="pin" className="block  mt-4">Pin</label>
          <input maxLength={6} type="text" name="pin" onChange={handleChange} value={pin} placeholder="Enter your 6 digit pincode" required className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
         <label htmlFor="area" className="block  mt-4">Area, Street, Sector</label>
          <input type="text" name="area" onChange={handleChange} value={area} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          <label htmlFor="city" className="block  mt-4">Town/City</label>
          <input type="text" name="city" onChange={handleChange} value={city} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          <label htmlFor="state" className="block  mt-4">State</label>
          <input type="text" name="state" onChange={handleChange} value={state} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

        <button onClick={handleUpdateUserDetails} className="disabled:bg-gray-400 enabled:bg-blue-400 mt-6 enabled:hover:bg-blue-500 text-gray-800 font-bold  px-4 py-1 rounded inline-flex items-center">

 <span> Update Details </span>
</button>

        </div>


      </div>


      <div className="md:w-1/2 w-3/4 md:ml-20 m-auto mt-10 mb-24  ">
        <h2 className="font-bold ">2. Password</h2>
        <div className=" mt-6 ">


          <label htmlFor="password" className="block  mt-4">Old password</label>
          <input type="password" name="password" onChange={handleChange} value={password} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          <label htmlFor="newpassword" className="block  mt-4">New password</label>
          <input type="password" name="newpassword" onChange={handleChange} value={newPassword} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />

          <label htmlFor="cnewpassword" className="block  mt-4">Confirm new password</label>
          <input type="password" name="cnewpassword" onChange={handleChange} value={cNewPassword} className="block md:w-9/12 w-full  mr-8 mt-2
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
       
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
          

        <button onClick={handleUpdatePassword}  className="disabled:bg-gray-400 enabled:bg-blue-400 mt-6 enabled:hover:bg-blue-500 text-gray-800 font-bold  px-4 py-1 rounded inline-flex items-center">

<span> Update Password</span>
</button>
        </div>
      </div>
      </div>
    </div>
  )
}
