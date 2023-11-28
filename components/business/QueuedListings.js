import { Loading } from "@nextui-org/react";
import { useState, useEffect } from "react";
import SimilarProducts from "@components/scoped/SimilarProducts";
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
    const response = await fetch("api/business/listing/getQueue");

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
    const total = products.reduce((sum, item) => {
      return sum + (item.extractedPrice || 0);
    }, 0);

    const average =
      products.length > 0
        ? parseFloat((total / products.length).toFixed(2))
        : 0;

    return average;
  };

  const findLowestPrice = (products) => {
    return products.reduce(
      (min, p) => (p.extractedPrice < min ? p.extractedPrice : min),
      products[0].extractedPrice
    );
  };

  const findHighestPrice = (products) => {
    return products.reduce(
      (max, p) => (p.extractedPrice > max ? p.extractedPrice : max),
      products[0].extractedPrice
    );
  };

  const setPriceOnDiscount = () => {
    const adjustedPrice = referencePrice * (1 + defaultPriceSuggestion / 100);
    setOpenListingPrice(parseFloat(adjustedPrice.toFixed(2)));
  };

  const onSelectSimilarProduct = (row) => {
    updatePriceReference(row.extractedPrice);
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
    const avgPrice = calulateAvgPrice(listing.similarProducts);
    setReferencePrice(avgPrice);
  };

  const closeOpenListing = () => {
    setOpenListing("");
    setOpenListingPrice(0);
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
    <div>
      {loadingQueue ? (
        <Loading />
      ) : (
        <div>
          {queuedListings.map((listing) => (
            <div key={listing.id}>
              <div className="flex">
                <Image
                  src={`${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}mainImage`}
                  alt={"Main Listing Photo"}
                  width={200}
                  height={200}
                />
                <h6>Status: {listing.status} </h6>

                {listing.status === "PROCESSED" &&
                  (openListing === listing.id ? (
                    <button onClick={closeOpenListing}>Close</button>
                  ) : (
                    <button onClick={() => onOpenListing(listing)}>Open</button>
                  ))}
              </div>
              {listing.status === "PROCESSED" && openListing === listing.id ? (
                <div>
                  <SimilarProducts
                    onSelect={onSelectSimilarProduct}
                    similarProducts={listing.relatedProducts}
                  />
                  <div className="flex justify-center mt-3">
                    <button onClick={() => updatePriceReference("high")}>
                      Highest Price: $
                      {findHighestPrice(listing.relatedProducts)}
                    </button>
                    <button onClick={() => updatePriceReference("avg")}>
                      Average Price: $
                      {calulateAvgPrice(listing.relatedProducts)}
                    </button>
                    <button onClick={() => updatePriceReference("low")}>
                      Lowest Price: ${findLowestPrice(listing.relatedProducts)}
                    </button>
                  </div>
                  <div className="flex mx-1 justify-between">
                    <div>
                      {}
                      <div className="">
                        <label className="block text-gray-600 text-3xl mb-2">
                          % Off
                        </label>
                        <div className="relative w-32 flex items-center">
                          <h3 className="absolute text-2xl right-8 mt-1">%</h3>
                          <input
                            value={defaultPriceSuggestion}
                            type="number"
                            className="w-48 mt-1 !text-4xl rounded-2xl pl-4 pr-2  !py-3 border-4 border-gray-400"
                            onChange={(e) =>
                              setDefaultPriceSuggestion(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-gray-600 text-3xl mb-2">
                          Your Price
                        </label>
                        <div className="relative flex items-center">
                          <h3 className="absolute text-4xl left-3 mt-1">$</h3>
                          <input
                            value={price}
                            type="number"
                            className="w-48 mt-1 !text-4xl rounded-2xl pl-10 pr-2  !py-3 border-4 border-gray-400"
                            onChange={(e) =>
                              setOpenListingPrice(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 justify-center">
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
                          className="w-24 h-24 text-green-500"
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
                        className="border-4 p-1 border-gray-400 rounded-2xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-24 h-24 text-red-500"
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

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => pushQueuedListing(listing.id, "DISPOSED")}
                      disabled={isUploading}
                      className={`${
                        tagFetching ? " pointer-events-none bg-gray-300" : ""
                      } hover:bg-red-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-red-500`}
                    >
                      Dispose
                    </button>
                    <button
                      disabled={isUploading}
                      onClick={() => pushQueuedListing(listing.id, "SALE")}
                      className={`${
                        tagFetching ? " pointer-events-none bg-gray-300" : ""
                      } hover:bg-green-500 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-green-500`}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueuedListings;
