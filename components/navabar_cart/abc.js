<p
className="absolute top-2 right-2  text-xl  w-6  "
>
<Skeleton circle/>
</p>

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

        {/* food name  */}
        <Skeleton />

</div>
        <div className="flex w-1/3 font-semibold items-center justify-center">
            {/* minus button */}
        <p className="text-xl w-4 "><Skeleton  /></p>
               {/* quantity */}
          <p className="w-3 m-3 "><Skeleton  /></p>
          {/* plus button */}
          <p  className="text-xl w-4 "><Skeleton /></p>
        </div>
      </div>
    </li>
  );
})}
</ol>
{Object.keys(cart).length > 0 && (
// total amount 
<p className="w-[8rem] text-lg mt-4 "><Skeleton /></p>
)}
<div className="flex text-center items-left justify-center mt-4">

<button
  className=" mr-6 outline-none  font-bold  px-1 rounded inline-flex items-center "
>
 
  <p className="w-[7rem] text-[1.3rem] "><Skeleton /></p>
  
</button>

<button
  className=" outline-none  font-bold px-1 rounded inline-flex items-center"
>
 
  <p className="w-[7rem] text-[1.2rem]"><Skeleton /></p>
</button>
</div>  
