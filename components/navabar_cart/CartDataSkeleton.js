import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { CartContext } from "./../../context/CartState";
import React, { useContext} from "react";
import styles from "../../styles/Navigation.module.css"
import { AiFillCloseCircle } from "react-icons/ai";
const CartDataSkeleton=()=>{

    const {
        cart,
        toggleCart
      } = useContext(CartContext);
    return (
        <>

        <span
            onClick={toggleCart}
            className="absolute top-3 right-2 cursor-pointer text-xl flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900 "
          >
            <AiFillCloseCircle />
          </span>
        
        {Object.keys(cart).length == 0 && (
          <div>
          <p className="text-center"><Skeleton /></p>
          <p className="text-center"><Skeleton /></p>
          </div>
        )}
        <ol className="  my-2 font-semibold">
          {Object.keys(cart).map((key) => {
            return (
              <li key={key}>
            
                <div className=" flex items-center mt-3 justify-center gap-1">
                <div className={`${styles.cartimageContainer}`}>

        <Skeleton className={`${styles.cartimageContainer}`} />
                  </div>
                  <div className="md:w-[18rem] w-[50%] pl-4 font-semibold text-gray-800">

       
             <Skeleton/>

      </div>
                  <div className="flex w-1/3 font-semibold items-center justify-center">
                  {/* minus  */}
<p  className="w-5 text-xl "><Skeleton /></p>
                    <span className={`m-2 w-3 `}><Skeleton/></span>
                   {/* plus  */}
                   <p  className="w-5 text-xl "><Skeleton /></p>

                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {Object.keys(cart).length > 0 && (
          <div className="w-[8rem] text-lg  mt-4 "><Skeleton /></div>
        )}
        <div className="flex text-center items-left justify-center mt-4">
            <button
              disabled={Object.keys(cart).length == 0}
              className=" mr-6 outline-none  font-bold  px-1 rounded inline-flex items-center "
            >
           
              <p className="w-[6rem] text-[1.2rem]"><Skeleton /></p>
            </button>
          <button
            disabled={Object.keys(cart).length == 0}
            className=" outline-none  font-bold px-1 rounded inline-flex items-center"
          >
        
            <p className="w-[6rem] text-[1.2rem]"><Skeleton /></p>
          </button>
        </div>
      
      </>
    )
}

export default CartDataSkeleton


