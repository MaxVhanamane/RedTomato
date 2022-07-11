import "../styles/globals.css";
import Navbar from "./../components/Navbar";
import CartState from "../context/CartState";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CartState>
        <Navbar />
        <Component {...pageProps} />
      </CartState>
    </>
  );
}

export default MyApp;
