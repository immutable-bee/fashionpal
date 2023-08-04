import React, { useState } from 'react';

const Tooltip = ({ id, content, children, width = 'max-w-sm' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {isOpen && (
        <div
          id={id}
          className={`${width} mb-2 absolute cursor-text z-10 p-2 text-sm w-full text-black bg-white rounded-xl !shadow bottom-full left-1/2 transform -translate-x-1/2`}

          onMouseLeave={() => setIsOpen(false)}
          style={{ bottom: '100%' }}
        >
          {content}
        </div>
      )}
      <div className='cursor-pointer' >
        {children}
      </div>
    </div>
  );
};

export default Tooltip;
