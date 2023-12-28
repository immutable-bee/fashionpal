import React, { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import SpeedListingForm from "@/components/scoped/SpeedListingForm";
import AdminListingForm2 from "@/components/scoped/AdminListingForm2";
import StandardListingForm from "../scoped/StandardListingForm";

function AddListing({ onBack, onFetch }) {
  const [listType, setListType] = useState("standard");
  const [islistTypeSelected, setIsListTypeSelected] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 pb-8 sm:pt-6 pt-0">
      <div className="flex items-center mb-4">
        <svg
          onClick={onBack}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <h3 className="ml-3 text-2xl">Add listing</h3>
      </div>

      {!islistTypeSelected ? (
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-center mt-5">
            <button
              onClick={() => setListType("speed")}
              className={`${
                listType === "speed" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Donations
            </button>

            <button
              onClick={() => setListType("standard")}
              className={`${
                listType === "standard" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Simple Lister
            </button>

            <button
              onClick={() => setListType("admin")}
              className={`${
                listType === "admin" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              AI Lister
            </button>
          </div>

          <ButtonComponent
            full
            onClick={() => setIsListTypeSelected(true)}
            className={`mt-16 mx-auto !w-64 rounded-lg !text-black`}
          >
            Next
          </ButtonComponent>
        </div>
      ) : (
        <>
          {listType === "admin" ? (
            <AdminListingForm2
              onBack={onBack}
              onFetch={onFetch}
            />
          ) : (
            ""
          )}

          {listType === "speed" ? (
            <SpeedListingForm
              onBack={onBack}
              onFetch={onFetch}
            />
          ) : (
            ""
          )}
          {listType === "standard" && (
            <StandardListingForm
              onBack={onBack}
              onFetch={onFetch}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AddListing;
