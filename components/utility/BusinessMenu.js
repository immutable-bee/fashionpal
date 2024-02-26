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
      className={` hidden sm:static absolute right-4 left-4 top-14 z-50 md:block md:w-auto ${
        open ? "!block" : ""
      } `}
      id="navbar-default"
    >
      <ul className="font-medium sm:w-auto w-full text-lg flex flex-col p-4 md:p-0 mt-4 border border-gray-100 sm:border-transparent rounded-lg sm:bg-transparent bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/business"
            )} `}
            href="/business"
            onClick={() => onClose()}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/business/listing-queue"
            )} `}
            href="/business/listing-queue"
            onClick={() => onClose()}
          >
            Queued Listings
          </Link>
        </li>
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/business/sales"
            )} `}
            href="/business/sales"
            onClick={() => onClose()}
          >
            Sales
          </Link>
        </li>
        <li>
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/business/dashboard"
            )} `}
            href="/business/dashboard"
            onClick={() => onClose()}
          >
            Dashboard
          </Link>
        </li>
        <li className="hidden">
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/business/sales"
            )} `}
            href="/business/sales"
          >
            Sales
          </Link>
        </li>
        <li className="hidden">
          <Link
            className={`block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary md:p-0 ${linkColor(
              "/consumer"
            )} `}
            href="/consumer"
          >
            Consumer
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeaderComponent;
