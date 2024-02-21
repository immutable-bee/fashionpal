import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logo from "../../assets/logo.png";

import OutsideClickHandler from "react-outside-click-handler";
import WebsiteMenu from "@/components/utility/WebsiteMenu";

const HeaderComponent = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);

  const router = useRouter();
  const linkColor = (path) => {
    return router.pathname === path ? "#E44A1F" : "#828282";
  };
  const openMenu = () => {
    if (!open) {
      setOpen(true);
    }
  };
  const goToProfile = () => {
    router.push("/business/profile");
    setIsDropdown(false);
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

  const openProfileDropdown = () => {
    setIsDropdown(true);
  };

  const outsideProfileDropdownClick = () => {
    setTimeout(() => {
      if (setIsDropdown) {
        setIsDropdown(false);
      }
    }, 10);
  };

  return (
    <div>
      <header className="flex fixed bg-white drop-shadow-md  mx-auto w-full justify-center sm:justify-between items-center px-2 sm:px-8 py-3">
        <button
          onClick={() => openMenu()}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 absolute left-3 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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

        <div className="sm:block hidden">
          <WebsiteMenu mobile={false} />
        </div>

        <div>
          <Link href="/">
            <Image
              src={Logo}
              width={120}
              height={58}
              className="w-48 sm:w-48"
              alt="logo"
            />
          </Link>
        </div>

        <div className="hidden sm:flex justify-end items-center gap-4 w-96">
          {/* <Link href="/auth">
            <button className="bg-primary hover:scale-110 sm:w-40 w-24 h-10 sm:h-14 rounded-lg text-base sm:text-2xl font-medium text-white duration-300 ease-in-out">
              Login
            </button>
          </Link>
          <Link href="/auth">
            <button className="border-[3px] border-primary sm:w-40 w-24 h-10 sm:h-14 rounded-lg text-base sm:text-2xl text-gray-700 font-medium hover:scale-110 duration-300 ease-in-out">
              Register
            </button>
          </Link> */}
        </div>
      </header>
      <div className="sm:hidden block">
        {open && (
          <OutsideClickHandler onOutsideClick={() => outsideClick()}>
            <WebsiteMenu
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
