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
        <ToastContainer

    position="bottom-left"
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
