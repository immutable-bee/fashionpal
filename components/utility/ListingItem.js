import Image from 'next/image';

function ListingItem({ mainPhoto, tags, children }) {
  return (
    <div
      className="px-4 py-4 relative rounded-3xl sm:mx-3 sm:my-3 my-5 w-full sm:w-[30rem] shadow-lg"
      style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="sm:flex">
        <div className="w-full sm:w-48 my-auto flex-shrink-0 mr-3">
          {mainPhoto ? <Image
            src={mainPhoto}
            width={100}
            height={100}
            className="rounded-lg w-full h-60 object-cover"
            alt=""
          /> : ''}
        </div>
        <div className="w-full sm:mt-0 mt-4 mb-3 flex flex-col justify-between ">
          <div className="sm:h-48 max-h-48 sm:mb-0 mb-2 overflow-y-auto sm:">
            {tags.map((tag, tagIndex) => (
              <p key={tagIndex} className="text-gray-800 text-base leading-5">
                {tag.name}: {tag.value}
              </p>
            ))}
          </div>

          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
