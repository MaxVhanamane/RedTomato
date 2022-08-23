import "../styles/globals.css";
import {useContext} from "react"
import Navbar from "./../components/Navbar";
import CartState,{CartContext} from "../context/CartState";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MyApp({ Component, pageProps }) {

  return (
    <>
      <CartState>
  
        <Navbar />
        {/* Using toast container in _app.js it will act as a global variable it will show all the toasts without any problems
        If I add it individually then it will create problems like if I login then after login I will redirect user to Login page then
        It won't be able to show toastcontainer that is declared on login page to avoid such problems I am adding toast container in _app.js page. 
        you can call this container using 

         toast.error/success/whatever(response.error, {
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
        */}
        <ToastContainer
    position="top-left"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
        <Component {...pageProps} />
      </CartState>
    </>
  );
}

export default MyApp;
