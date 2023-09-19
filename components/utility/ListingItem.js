import Image from 'next/image';

function ListingItem({ mainPhoto, tags, children, clickable = false }) {
  return (
    <div
      className={`px-4 py-4 sm:!w-64 w-full relative rounded-3xl mx-2 my-2 ${clickable ? 'cursor-pointer hover:opacity-90 ' : ''} `}
      style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
    >


      <div className='flex flex-col justify-between h-full'>
        <div>
          {mainPhoto ? <Image
            src={mainPhoto}
            width={100}
            height={100}
            className="rounded !w-full !h-64 object-cover"
            alt=""
          /> : ''}

          <div className="mt-2.5">

            {tags.slice(0, 3).map((tag, tagIndex) => (
              <p key={tagIndex} className="text-gray-800 text-base leading-5">
                {tag.name}: {tag.value}
              </p>
            ))}


          </div>
        </div>
        <div className='mt-1.5'>
          {children}
        </div>
      </div>
    </div>

  );
}

export default ListingItem;
