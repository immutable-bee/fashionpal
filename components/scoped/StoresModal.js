import { useState, useEffect } from "react";
import Image from "next/image";
import ModalComponent from "@/components/utility/Modal";
import cloneDeep from "lodash.clonedeep";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
import Link from "next/link";
import BookSVG from "../../assets/book.svg";
function ProductDetails({ open, onClose }) {
  const [listings, setListings] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);

  const onDeleteStore = (index) => {
    let newListings = cloneDeep(listings);
    newListings.splice(index, 1);
    setListings(newListings);
  };

  return (
    <div>
      {open ? (
        <ModalComponent
          open={open}
          title="Stores"
          width={this.state.computedValue}
          onClose={() => onClose()}
          footer={
            <div className="flex justify-end w-full">
              <button
                className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
                onClick={() => onClose()}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="sm:flex flex-wrap justify-center mt-2">
            {listings.map((row, key) => {
              return (
                <div
                  key={key}
                  className="border border-gray-300 m-2 w-48 rounded-xl p-[11px]"
                >
                  <div>
                    <div>
                      <div className="bg-sky-200 mx-auto py-8 rounded-xl">
                        <Image
                          src={BookSVG}
                          alt="icon"
                          className="mx-auto"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mt-[12px]">
                        <p className="mb-0 font-serif text-xs ">
                          The Little Prince
                        </p>
                        <DeleteModalComponent
                          title="Are you sure you want to delete store?"
                          onConfirmed={() => onDeleteStore(key)}
                        >
                          <button className=" hover:opacity-90 text-red-600 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </DeleteModalComponent>
                      </div>
                      <label className="font-serif text-xs mt-[6px] text-gray-400">
                        Store San Diego
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalComponent>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProductDetails;
