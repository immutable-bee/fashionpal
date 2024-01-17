import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import BookWorm from "../../assets/worm.webp";
import OutsideClickHandler from "react-outside-click-handler";
import BusinessMenu from "@/components/utility/BusinessMenu";

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

        <div className="flex flex-col">
          <div
            class="flex items-center cursor-pointer"
            onClick={() => openProfileDropdown()}
          >
            <div class="">
              <div className="border rounded-full w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <Image
                  src={BookWorm}
                  width={40}
                  height={40}
                  className="w-10 rounded-full"
                  alt="logo"
                />
              </div>
            </div>
            <h4 class="sm:block hidden text-gray-800 !font-semibold text-base my-0 md:text-xl mx-3">
              <span>
                {session && session.user && session.user.email
                  ? session.user.email.split("@")[0]
                  : "Demo User!"}
              </span>
            </h4>
            <svg
              class="w-3 h-3 md:w-4 md:h-4 !ml-2 sm:!ml-0"
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path
                d="M10 0.5H0L5 5.5L10 0.5Z"
                fill="#495057"
              />
            </svg>
          </div>
          {isDropdown && (
            <OutsideClickHandler
              onOutsideClick={() => outsideProfileDropdownClick()}
            >
              <div class="bg-white border border-gray-200 rounded-2xl shadow-lg w-60 sm:w-64  py-2 absolute top-14 right-3 z-50">
                <div class="sm:hidden block text-grayone border-b text-base px-4 py-2 rounded-lg w-full">
                  <span class="ml-2 flex items-center text-gray-600 hover:opacity-80 break-words">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-6 w-6 mr-2 text-gray-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>

                    <span>
                      {session && session.user && session.user.email
                        ? session.user.email.split("@")[0]
                        : "Demo User!"}
                    </span>
                  </span>
                </div>

                <div
                  onClick={() => goToProfile()}
                  class="text-gray-900 text-base cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-lg w-full"
                >
                  <span class="ml-2 flex items-center text-gray-900 hover:opacity-80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-5 w-5 mr-2 text-gray-900"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Profile
                  </span>
                </div>

                <div
                  onClick={() => signOut()}
                  class="text-gray-900 text-base cursor-pointer px-4 py-2 hover:bg-gray-50 rounded-lg w-full"
                >
                  <span class="ml-2 flex items-center text-gray-900 fill-gray-900 hover:opacity-80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-5 w-5 mr-2 text-gray-900"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                      />
                    </svg>
                    Logout
                  </span>
                </div>
              </div>
            </OutsideClickHandler>
          )}
        </div>
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
