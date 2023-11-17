import React, { useState, useEffect } from "react";
import LoadingComponent from "../utility/loading";

function ButtonComponent({ imageUrl = "", onSelect, similarProducts }) {
  const [fetchingSimilarProducts, setFetchingSimilarProducts] = useState(false);

  const [activeResultIndex, setActiveResultIndex] = useState(0);

  const onSelectSimilarProduct = (key) => {
    const row = similarProducts[key];
    setActiveResultIndex(key);

    onSelect(row);
  };

  return (
    <div>
      {!fetchingSimilarProducts ? (
        <div className="mt-3 flex overflow-x-auto max-w-full">
          {similarProducts.map((row, key) => (
            <div
              key={key}
              className="mx-2 w-48 cursor-pointer"
              onClick={() => onSelectSimilarProduct(key)}
            >
              <div
                className={`${
                  activeResultIndex === key
                    ? "border-[3px] border-green-600"
                    : "border-2 border-primary"
                } flex items-center justify-center rounded-2xl px-4 py-5 !w-48 !h-48 flex-shrink-0 my-1 relative`}
              >
                <img
                  src={row.thumbnail}
                  alt={"Main Photo"}
                  className="rounded max-w-full max-h-full"
                />
              </div>
              <div
                key={key}
                className="mt-2 mx-1 w-full"
              >
                <h3 className="text-2xl text-center truncate">{row.name}</h3>
                <h3 className="text-2xl text-center">
                  {row.price ? row.price : "No price"}
                </h3>
                <div className="flex justify-center">
                  <button
                    onClick={() => viewProduct(row.link)}
                    className="underline text-2xl"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <LoadingComponent size="sm" />
      )}
    </div>
  );
}

export default ButtonComponent;
