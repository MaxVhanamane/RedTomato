import React,{useEffect,useContext} from 'react'
import { useRouter } from 'next/router';
import { CartContext } from "./../context/CartState";

export default function Orders() {
  const router=useRouter()
  const {token}=useContext(CartContext)
  useEffect(()=>{
   
    if(!token){
     router.push("/")
    }
     },[token])
  return (
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum esse repudiandae, iure placeat enim quas nisi asperiores suscipit tenetur? Accusantium sint consequuntur amet tempore magnam doloremque asperiores expedita, eaque culpa nesciunt sunt atque velit, cum ditate quae fugit quibusdam cum iure perspiciatis unde neque accusamus repellendus quis. Deserunt sit laboriosam sapiente eum labore ut earum suscipit. Dicta odit laborum ratione facilis delectus reiciendis libero autem distinctio! Sequi magni cupiditate quo sapiente facere corrupti, qui praesentium numquam odit distinctio odio totam dolorum. Ea facilis qui eveniet error eaque ab rem perferendis eos laudantium. Suscipit aperiam labore dolore possimus ratione maxime illo expedita voluptatem voluptas, aspchitecto illum? Laboriosam ab sunt, aliquid voluptate, totam deserunt laborum excepturi ea, iste similique consequatur minima itaque pluptatum accusamus dolore dolores non? Dolorem placeat sapiente a vitae repudiandae asperiores mollitia, adipisci labore qui alias, necessitatibus nemo quos sed possimus. Culpa ab ipsa, voluptatibus beatae nostrum recusandae id, cupiditate odio reiciendis necessitatibus provident fugiat, qui officia laboriosam tempore natus.
    </div>
  )
}
