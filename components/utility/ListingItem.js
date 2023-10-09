import Image from 'next/image';

function ListingItem({ mainPhoto, brandPhoto, tags = [], children = '', clickable = false, isSlot = true }) {

  const stopClick = (event) => {
    event.stopPropagation();
  }
  return (
    <div


      className={`px-4 py-4 sm:!w-64 overflow-hidden w-full relative rounded-3xl group [perspective:1000px] mx-2 my-2 ${clickable ? 'cursor-pointer hover:opacity-90 ' : ''} `}
      style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
    >

      <div
        class="relative h-[255px] w-full rounded-xl shadow-xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >

        <div class="absolute inset-0">
          <Image
            src={mainPhoto}
            width={100}
            height={100}
            className="rounded-xl !w-full !h-64 object-cover"
            alt=""
          />
        </div>

        <div
          class="absolute inset-0 h-full w-full rounded-xl text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]"
        >
          <Image
            src={brandPhoto}
            width={100}
            height={100}
            className="rounded-xl !w-full !h-64 object-cover"
            alt=""
          />
        </div>
      </div>
      <div className="mt-4">
        {tags.length !== 0 && tags.slice(0, 3).map((tag, tagIndex) => (
          <p key={tagIndex} className="text-gray-800 text-base leading-5">
            {tag}
          </p>
        ))}
        {isSlot && children ?
          <div className='mt-1.5' onClick={stopClick}>
            {children}
          </div> : ''}
      </div>


    </div>
    //   <div
    //    className={`px-4 py-4 sm:!w-64 overflow-hidden w-full relative group [perspective:1000px] rounded-3xl mx-2 my-2 ${clickable ? 'cursor-pointer hover:opacity-90 ' : ''} `}
    //     style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
    // >

    //   <div
    //     class="relative h-[235px] overflow-hidden w-full rounded-xl shadow-xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
    //   >

    //     <div class="absolute inset-0">
    //     <Image
    //           src={mainPhoto}
    //           width={100}
    //           height={100}
    //           className="rounded !w-full !h-64 object-cover"
    //           alt=""
    //         />
    //     </div>

    //     <div
    //       class="absolute inset-0 h-full w-full rounded-xl text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]"
    //     >
    //     <Image
    //           src={brandPhoto}
    //           width={100}
    //           height={100}
    //           className="rounded !w-full !h-80 object-cover"
    //           alt=""
    //         />
    //     </div>
    //   </div>
    //   <div className="mt-2.5">
    //           {tags.length !== 0 && tags.slice(0, 3).map((tag, tagIndex) => (
    //             <p key={tagIndex} className="text-gray-800 text-base leading-5">
    //               {tag}
    //             </p>
    //           ))}
    //         </div>
    //             {isSlot && children ? 
    //       <div className='mt-1.5' onClick={stopClick}>
    //         {children}
    //       </div> : ''}
    // </div>
    // <div
    //   className={`px-4 py-4 sm:!w-64 w-full relative rounded-3xl mx-2 my-2 ${clickable ? 'cursor-pointer hover:opacity-90 ' : ''} `}
    //   style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
    // >


    //   <div className='flex flex-col justify-between h-full'>
    //     <div>
    //       {mainPhoto ? <Image
    //         src={mainPhoto}
    //         width={100}
    //         height={100}
    //         className="rounded !w-full !h-64 object-cover"
    //         alt=""
    //       /> : ''}

    //       <div className="mt-2.5">
    //         {tags.length && tags.slice(0, 3).map((tag, tagIndex) => (
    //           <p key={tagIndex} className="text-gray-800 text-base leading-5">
    //             {tag}
    //           </p>
    //         ))}
    //       </div>
    //     </div>
    //     {isSlot && children ? 
    //     <div className='mt-1.5' onClick={stopClick}>
    //       {children}
    //     </div> : ''}
    //   </div>
    // </div>

  );
}

export default ListingItem;
