import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import { Modal } from "@nextui-org/react";
import { NotificationManager } from "react-notifications";
import Loading from "@/components/utility/loading";
import { useRouter } from "next/router";
import SampleProductImage from "../../../assets/sample-product.jpg";

const PerksModalContent = () => {
  return (
    <>
      <Modal.Header>
        <h1 className="text-2xl">Member Benefits</h1>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M8 1.75a.75.75 0 0 1 .692.462l1.41 3.393 3.664.293a.75.75 0 0 1 .428 1.317l-2.791 2.39.853 3.575a.75.75 0 0 1-1.12.814L7.998 12.08l-3.135 1.915a.75.75 0 0 1-1.12-.814l.852-3.574-2.79-2.39a.75.75 0 0 1 .427-1.318l3.663-.293 1.41-3.393A.75.75 0 0 1 8 1.75Z"
                clip-rule="evenodd"
              />
            </svg>
            <h1 className="text-lg"> EXCLUSIVE MEMBER DISCOUNTS</h1>
          </div>
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              <path
                fill-rule="evenodd"
                d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                clip-rule="evenodd"
              />
            </svg>

            <h1 className="text-lg"> ACCESS TO THE WEEKLY FIRST PEEK </h1>
          </div>
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>

            <h1 className="text-lg"> NEWSLETTER</h1>
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

function Scan() {
  const router = useRouter();
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loadingListings, setLoadingListings] = useState(true);

  const [product, setProduct] = useState({
    isSaleAllUsers: true,
    mainImageUrl: SampleProductImage,
    discountAllUsers: 20,
    discountPercentage: 20,
    price: 10,
  });

  const formatPrice = (priceString) => {
    if (Number(priceString) === parseInt(priceString, 10)) {
      return `${priceString}.00`;
    }
    return priceString;
  };

  const fetchListing = useCallback(async (e) => {
    try {
      const res = await fetch(`/api/consumer/fetchListingWithFollowing/${e}`);

      if (res.status === 200) {
        const data = await res.json();
        setProduct(data.result);
      } else {
        const errorMessage = await res.text();
        console.error(
          `Fetch failed with status: ${res.status}, message: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching listings:", error);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    const initialFetch = async (e) => {
      await fetchListing(e);
    };
    console.log(router.query.id);
    if (router.query.id) {
      initialFetch(router.query.id);
    }
  }, [router.query, fetchListing]);

  const perksModalOpenHandler = () => {
    setIsPerksModalOpen(true);
  };

  const perksModalCloseHandler = () => {
    setIsPerksModalOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = (value) => {
    return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  };

  const followBusiness = async () => {
    const response = await fetch("/api/consumer/followBusiness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessId: product.Business.id, hash: "" }),
    });
    await fetchListing(router.query.id);
  };

  return (
    <div className="sm:w-96 sm:shadow sm:rounded-lg px-3 sm:py-3 mx-auto mt-6 sm:mt-8 mb-10 ">
      <Modal
        open={isPerksModalOpen}
        closeButton
        onClose={perksModalCloseHandler}
      >
        <PerksModalContent />
      </Modal>
      {loadingListings ? (
        <div className=" w-full mt-10">
          <div>
            <div className="">
              <Loading size="xl" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {product.isSaleAllUsers && (
            <div className="bg-red-600 rounded-xl uppercase text-white text-center py-3 sm:py-4 text-2xl sm:text-3xl">
              {product.discountAllUsers}% Off
            </div>
          )}

          <div className=" mx-auto   rounded-2xl w-full   relative">
            <Image
              src={
                product.mainImageUrl
                  ? product.mainImageUrl
                  : "/images/fpLogo.png"
              }
              width={100}
              height={100}
              className="rounded-xl w-full mx-auto object-cover"
              alt=""
            />
          </div>

          <div>
            <h3 className="text-xl text-center mt-3  uppercase">Price</h3>

            <div className="relative w-28 h-28 mb-2 mx-auto mt-2 group">
              <div className="absolute inset-0 border-4 border-green-300 rounded-full shadow-md"></div>
              <div className="absolute inset-2 border-2 border-green-300 rounded-full flex justify-center items-center bg-white animate-pulse-once shadow-md">
                <h3 className="text-3xl">${formatPrice(product.price)}</h3>
              </div>
            </div>
          </div>

          <div className="py-2">
            {product.discountPercentage && product.price && (
              <div>
                <h3 className="text-xl text-center mt-3  uppercase">
                  Member Price
                </h3>

                <div className="relative w-28 h-28 mb-2 mx-auto mt-2 group">
                  <div className="absolute inset-0 border-4 border-green-300 rounded-full shadow-md"></div>
                  <div className="absolute inset-2 border-2 border-green-300 rounded-full flex justify-center items-center bg-white animate-pulse-once shadow-md">
                    <h3 className="text-3xl">${product.discountPercentage}</h3>
                  </div>
                </div>
              </div>
            )}

            <h3
              className="text-2xl cursor-pointer text-blue-500 underline text-center mt-3"
              onClick={perksModalOpenHandler}
            >
              Perks
            </h3>
          </div>
          {!product.isFollowing && (
            <div className="pt-2  flex flex-col items-center">
              <h2>Become a member by following this store to save</h2>
            </div>
          )}

          {product.isFollowing ? (
            <div className="bg-green-200 rounded-lg mt-5 py-3 px-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 flex-shrink-0 text-gray-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>

              <div>
                <h6 className="text-gray-700">
                  You are following{" "}
                  {product.Business?.businessName || "this store"}.
                </h6>
              </div>
            </div>
          ) : (
            <ButtonComponent
              rounded
              className="mt-5"
              full
              type="submit"
              onClick={followBusiness}
            >
              Follow {product.Business?.businessName || "this store"}
            </ButtonComponent>
          )}
        </>
      )}
    </div>
  );
}

export default Scan;
