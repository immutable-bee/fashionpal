import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const HeaderComponent = ({ open, close, mobile }) => {
  const router = useRouter();
  const linkColor = (path) => {
    return router.pathname === path ? "text-primary" : "text-[#828282]";
  };

  const onClose = () => {
    if (mobile) {
      close();
    }
  };

  return (
    <div
      className={` hidden sm:static fixed right-4 sm:drop-shadow-none drop-shadow-md left-4 top-14 z-50 md:block md:w-auto ${
        open ? "!block" : ""
      } `}
      id="navbar-default"
    >
      <ul className="font-medium sm:w-auto w-full text-xl sm:text-2xl flex flex-col p-4 md:p-0 mt-4 border border-gray-100 sm:border-transparent rounded-lg sm:bg-transparent bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${linkColor(
              "/business"
            )} `}
            href="#"
            onClick={() => onClose()}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${linkColor(
              "/business/listing-queue"
            )} `}
            href="#pricing"
            onClick={() => onClose()}
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 ${linkColor(
              "/business/sales"
            )} `}
            href="#contact-us"
            onClick={() => onClose()}
          >
            Contact Us
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderComponent;
