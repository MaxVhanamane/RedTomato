import dynamic from "next/dynamic";
const Footer = dynamic(() => import("./Footer"), {
  ssr: false,
});
import Navbar from "./Navbar";
import { useContext, useEffect } from "react";
import { CartContext } from './../context/CartState';
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const { removeToken } = useContext(CartContext);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    async function verify() {
      try {
        const res = await fetch('/api/verifyauthexptime', {
          method: 'GET',
        });
        const response = await res.json();
        if (!response.success) {
          removeToken();
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("token");
        }
      } catch (e) {
        // network issue, avoid disruptive alerts
      }
    }

    verify();
  }, [router.pathname]);

  return (
    <div className='h-screen'>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
