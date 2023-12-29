import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import BookWorm from "../../assets/worm.webp";
import { useSession } from "next-auth/react";
import OutsideClickHandler from "react-outside-click-handler";
import BusinessMenu from "@/components/utility/BusinessMenu";

const HeaderComponent = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const linkColor = (path) => {
    return router.pathname === path ? "#E44A1F" : "#828282";
  };
  const openMenu = () => {
    if (!open) {
      setOpen(true);
    }
  };

  const outsideClick = () => {
    setTimeout(() => {
      if (open) {
        setOpen(false);
      }
    }, 10);
  };

  const handleClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <div>
      <header className="flex  mx-auto w-full justify-between items-center px-2 sm:px-4 py-3">
        <button
          onClick={() => openMenu()}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div>
          <Link href="/business">
            <Image
              src="/images/logo-vertical.jpg"
              width={120}
              height={58}
              className="w-36 sm:w-48"
              alt="logo"
            />
          </Link>
        </div>
        <div className="sm:block hidden">
          <BusinessMenu mobile={false} />
        </div>
        <Link
          href="/business/profile"
          className="flex items-center no-underline"
        >
          {" "}
          <div className="border rounded-full w-14 h-14 flex-shrink-0 flex items-center justify-center">
            <Image
              src={BookWorm}
              width={40}
              height={40}
              className="w-10 rounded-full"
              alt="logo"
            />
          </div>
          <span className="!ml-3 capitalize hidden sm:block text-black font-semibold text-lg">
            Hi,{" "}
            {session && session.user && session.user.email
              ? session.user.email.split("@")[0]
              : "Demo User!"}
          </span>
        </Link>
      </header>
      <div className="sm:hidden block">
        {open && (
          <OutsideClickHandler onOutsideClick={() => outsideClick()}>
            <BusinessMenu
              mobile={true}
              open={open}
              close={() => setOpen(false)}
            />
          </OutsideClickHandler>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
