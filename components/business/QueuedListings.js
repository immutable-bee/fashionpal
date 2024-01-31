import Loading from "@/components/utility/loading";
import { useState, useEffect } from "react";
import SimilarProducts from "../scoped/SimilarProducts";
import Image from "next/image";

const QueuedListings = () => {
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [queuedListings, setQueuedListings] = useState([]);

  // For opening listing dropdown based on id
  const [openListing, setOpenListing] = useState();
  const [openListingData, setOpenListingData] = useState();

  const [defaultPriceSuggestion, setDefaultPriceSuggestion] = useState(-10);
  const [referencePrice, setReferencePrice] = useState();
  const [openListingPrice, setOpenListingPrice] = useState(0);

  const [isUploading, setIsUploading] = useState(false);

  const getQueue = async (req, res) => {
    setLoadingQueue(true);
    const response = await fetch("/api/business/listing/getQueue");

    if (!response.ok) {
      console.error("Failed to get queue");
    }
    const queue = await response.json();
    setQueuedListings(queue.listings);
    setLoadingQueue(false);
  };

  useEffect(() => {
    getQueue();
  }, []);

  const calulateAvgPrice = (products) => {
    const total = products.reduce(
      (sum, item) => sum + parseFloat(item.price || 0),
      0
    );
    return products.length > 0
      ? parseFloat((total / products.length).toFixed(2))
      : 0;
  };

  const findLowestPrice = (products) => {
    return Math.min(
      ...products.map((product) => parseFloat(product.price || Infinity))
    );
  };

  const findHighestPrice = (products) => {
    return Math.max(
      ...products.map((product) => parseFloat(product.price || -Infinity))
    );
  };

  const setPriceOnDiscount = () => {
    const adjustedPrice = referencePrice * (1 + defaultPriceSuggestion / 100);
    setOpenListingPrice(parseFloat(adjustedPrice.toFixed(2)));
  };

  const onSelectSimilarProduct = (row) => {
    updatePriceReference(row.price);
  };

  const pushQueuedListing = async (id, status) => {
    setIsUploading(true);

    const payload = {
      data: {
        id: id,
        price: parseFloat(openListingPrice),
        status: status,
      },
    };

    const response = await fetch("/api/business/listing/pushQueuedListing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }
    setIsUploading(false);
    return;
  };

  const onOpenListing = (listing) => {
    setOpenListing(listing.id);
    setOpenListingData(listing);
    const avgPrice = calulateAvgPrice(listing.relatedProducts);
    setReferencePrice(avgPrice);
  };

  const closeOpenListing = () => {
    setOpenListing("");
    setOpenListingPrice(0);
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setOpenListingPrice(value.toString());
    }
  };

  const handlePriceBlur = () => {
    let value = parseFloat(price);
    if (isNaN(value) || value < 0) value = 0;
    setOpenListingPrice(value.toFixed(2));
  };

  const updatePriceReference = (ref) => {
    if (ref === "high" || ref === "low" || ref === "avg") {
      if (ref === "high") {
        const highestPrice = findHighestPrice(openListingData.relatedProducts);
        setReferencePrice(highestPrice);
      }
      if (ref === "low") {
        const lowestPrice = findLowestPrice(openListingData.relatedProducts);
        setReferencePrice(lowestPrice);
      }
      if (ref === "avg") {
        const avgPrice = calulateAvgPrice(openListingData.relatedProducts);
        setReferencePrice(avgPrice);
      }
    } else {
      setReferencePrice(ref);
    }
  };

  useEffect(() => {
    if (openListing) {
      if (referencePrice) {
        setPriceOnDiscount();
      }
    }
  }, [defaultPriceSuggestion, openListing, referencePrice]);

  return (
    <div className="bg-white pb-5">
      <div className="mt-8 px-2 sm:px-4">
        {loadingQueue ? (
          <div className="sm:flex justify-center pb-10">
            <div>
              <div className="pt-2.5 mt-10">
                <Loading size="xl" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full gap-3 flex items-start flex-col justify-center">
            {queuedListings && queuedListings.length !== 0 ? (
              <>
                {queuedListings.map((listing) => (
                  <div
                    className={`w-full sm:max-w-3xl mx-auto flex flex-col shadow rounded-2xl overflow-hidden border ${
                      openListing === listing.id ? "flex-col" : ""
                    }`}
                    key={listing.id}
                  >
                    <div
                      className={`flex gap-1 w-full h-24 items-center justify-between pr-4`}
                    >
                      <div className="flex items-center">
                        <Image
                          src={listing.mainImage}
                          alt={"Main Listing Photo"}
                          className="h-24"
                          width={100}
                          height={100}
                        />

                        <h6 className="ml-3">Status: {listing.status} </h6>
                      </div>

                      {listing.status === "PROCESSED" &&
                        (openListing === listing.id ? (
                          <button onClick={closeOpenListing}>
                            <Image
                              src={"/images/chevron-up.svg"}
                              alt={"Close listing details icon"}
                              width={25}
                              height={25}
                            />
                          </button>
                        ) : (
                          <button onClick={() => onOpenListing(listing)}>
                            <Image
                              src={"/images/chevron-down.svg"}
                              alt={"Open listing details icon"}
                              width={25}
                              height={25}
                            />
                          </button>
                        ))}
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in ${
                        openListing === listing.id
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div>
                        <SimilarProducts
                          onSelect={onSelectSimilarProduct}
                          similarProducts={listing.relatedProducts}
                        />
                      </div>
                      <div className="flex justify-evenly mt-3">
                        <button onClick={() => updatePriceReference("high")}>
                          Highest Price: $
                          {findHighestPrice(listing.relatedProducts)}
                        </button>
                        <button onClick={() => updatePriceReference("avg")}>
                          Average Price: $
                          {calulateAvgPrice(listing.relatedProducts)}
                        </button>
                        <button onClick={() => updatePriceReference("low")}>
                          Lowest Price: $
                          {findLowestPrice(listing.relatedProducts)}
                        </button>
                      </div>
                      <div className="flex mx-1 justify-between">
                        <div className="w-full flex justify-center gap-5  mt-2">
                          <div>
                            <div className="">
                              <label className="block text-gray-600 text-xl">
                                % Off
                              </label>
                              <div className="relative w-32 flex items-center">
                                <h3 className="absolute text-2xl right-8 mt-1">
                                  %
                                </h3>
                                <input
                                  value={defaultPriceSuggestion}
                                  type="number"
                                  className="w-32 mt-1 !text-2xl rounded-2xl pl-4 pr-2  !py-2 border-4 border-gray-400"
                                  onChange={(e) =>
                                    setDefaultPriceSuggestion(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="mt-3">
                              <label className="block text-gray-600 text-xl">
                                Your Price
                              </label>
                              <div className="relative flex items-center">
                                <h3 className="absolute text-2xl left-3 mt-1">
                                  $
                                </h3>
                                <input
                                  value={openListingPrice}
                                  type="number"
                                  className="w-32 mt-1 !text-2xl rounded-2xl pl-10 pr-2 !py-2 border-4 border-gray-400"
                                  onChange={handlePriceChange}
                                  onBlur={handlePriceBlur}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-start mt-8 ">
                            <button
                              onClick={() =>
                                setDefaultPriceSuggestion(
                                  Number(Number(defaultPriceSuggestion) + 5)
                                )
                              }
                              className="border-4 p-1 border-gray-400 rounded-2xl"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-10 h-10 text-green-500"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                setDefaultPriceSuggestion(
                                  Number(Number(defaultPriceSuggestion) - 5)
                                )
                              }
                              className="border-4 p-1 mt-11 border-gray-400 rounded-2xl"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-10 h-10 text-red-500"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 mb-3 mt-3">
                        <button
                          onClick={() =>
                            pushQueuedListing(listing.id, "DISPOSED")
                          }
                          disabled={isUploading}
                          className={`w-40 hover:bg-red-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl  text-xl py-2.5  border-2 border-red-500`}
                        >
                          Dispose
                        </button>
                        <button
                          disabled={isUploading}
                          onClick={() => pushQueuedListing(listing.id, "SALE")}
                          className={`w-40 hover:bg-green-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl  text-xl py-2.5  border-2 border-green-500`}
                        >
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <h3 className="text-2xl text-center mt-5">No queued listings!</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuedListings;
