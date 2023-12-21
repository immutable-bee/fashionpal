import { useState, useEffect } from "react";
import HeaderComponent from "@/components/utility/Header";
import SubscriptionModal from "@/components/scoped/SubscriptionModal";
import ButtonComponent from "@/components/utility/Button";
// import { useUser } from "@/context/UserContext";
import { NotificationManager } from "react-notifications";

import { signOut } from "next-auth/react";
import { Loading } from "@nextui-org/react";
import { QRCode } from "react-qrcode-logo";

const ThriftListComponent = ({}) => {
  const [user, setUser] = useState({});

  return (
    <div className='min-h-screen bg-white '>
      <HeaderComponent />
      <div className='w-full flex items-center justify-center'>
        <div className='bg-white rounded shadow  p-6 m-4 w-full lg:w-3/4 lg:max-xl: '>
          <div className='mb-4'>
            <h1 className='text-lg sm:text-2xl font-medium text-center '>
              Thrift List
            </h1>
          </div>
          <div>
            <div className='flex mb-4 items-center'>
              <input
                id='comments'
                aria-describedby='comments-description'
                name='comments'
                type='checkbox'
                className='h-6 w-6 mr-2 rounded accent-white border-solid border-2 border-black'
              />
              <p className='w-full text-grey-darkest'>
                Add another component to Tailwind Components
              </p>

              <button className='flex-no-shrink p-2 ml-4 mr-2 border-2 bg-red-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  />
                </svg>
              </button>
            </div>
            <div className='flex mb-4 items-center'>
              <input
                id='comments'
                aria-describedby='comments-description'
                name='comments'
                defaultChecked={true}
                type='checkbox'
                // onChange={() => handlecheck(2)}
                className='h-6 w-6 mr-2 rounded accent-white border-solid border-2 border-black'
              />
              <p className='w-full line-through text-grey-darkest'>
                Add another component to Tailwind Components
              </p>

              <button className='flex-no-shrink p-2 ml-4 mr-2 border-2 bg-red-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThriftListComponent;
