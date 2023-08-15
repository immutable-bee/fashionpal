import Image from 'next/image';

function ListingItem({ mainPhoto, tags, children }) {

  return (
    <div
      className="px-4 py-4 relative rounded-lg sm:mx-2 my-2 w-full sm:w-96 border-2 shadow-lg border-[#E44A1F]"
    >
      <div className="flex">
        <div className="w-24 my-auto flex-shrink-0 mr-3 rounded-lg">
          <Image
            src={mainPhoto}
            width={100}
            height={100}
            className="rounded"
            alt=""
          />
        </div>
        <div className="w-full mb-3 ">
          <div className="sm:h-36 sm:overflow-y-auto">

            {tags.map((tag, tagIndex) => (
              <p key={tagIndex} className="text-gray-800 text-base leading-5">
                {tag.name}: {tag.value}
              </p>
            ))}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
