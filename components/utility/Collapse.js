import React, { useState } from 'react';

const Collapse = ({ title, subtitle, contentLeft, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b'>
      <div className="flex justify-between items-center py-5  cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          {contentLeft}
          <div className="ml-2">
            <h2 className='text-black text-base'>{title}</h2>
            <h3 className='text-gray-500 text-base'>{subtitle}</h3>
          </div>
        </div>
        <div className="transition-transform duration-500 ease-in-out">
          {!isOpen ?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          }


        </div>


      </div>
      {isOpen && (
        <div className="mt-2 px-3 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapse;
