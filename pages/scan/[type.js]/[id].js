import { useState, useMemo } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import { Modal } from "@nextui-org/react";
import { NotificationManager } from "react-notifications";

const PerksModalContent = () => {
  return (
    <>
      <Modal.Header>
        <h1 className="text-2xl">SUBSCRIBE</h1>
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
            <h1 className="text-lg"> EXCLUSIVE SUBSCRIBER DISCOUNTS</h1>
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
  const [isPerksModalOpen, setIsPerksModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState({
    price: 10.0,
    isSaleAllUsers: true,
    discountAllUsers: 20, // 20% off for all users
    isSaleSubscribers: true,
    discountSubscribers: 30, // 30% off for subscribers
    mainImageUrl:
      "https://jhkrtmranrjztkixgfgf.supabase.co/storage/v1/object/public/standard-listings/05e56499-0cd1-4683-ad8e-1c24c9b977d4/clq52jr0s000kx4kjnvna75ry/brandImage",
  });

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

  const handleSubscribe = () => {
    if (!email) {
      NotificationManager.error("Email is required!");
      return;
    }
    if (!validateEmail(email)) {
      NotificationManager.error("Email must be valid!");
      return;
    }
  };

  const discountedPrice = useMemo(() => {
    const price = product.price;
    const discount = product.discountAllUsers / 100; // Convert percentage to decimal

    return (price - price * discount).toFixed(2);
  }, [product.price, product.discountAllUsers]);

  const discountedPriceForSubscribers = useMemo(() => {
    const price = parseFloat(discountedPrice); // Access the computed value
    const discount = product.discountSubscribers / 100; // Convert percentage to decimal

    return (price - price * discount).toFixed(2);
  }, [discountedPrice, product.discountSubscribers]);

  return (
    <div className="sm:w-96 mx-auto mt-6 sm:mt-8 mb-10 sm:px-0 px-3">
      <Modal
        open={isPerksModalOpen}
        closeButton
        onClose={perksModalCloseHandler}
      >
        <PerksModalContent />
      </Modal>

      {product.isSaleAllUsers && (
        <div className="bg-red-600 rounded-xl uppercase text-white text-center py-3 sm:py-4 text-2xl sm:text-3xl">
          {product.discountAllUsers}% Off
        </div>
      )}

      <div className=" mx-auto mt-6 sm:mt-8  rounded-2xl w-full   relative">
        <Image
          src={product.mainImageUrl}
          width={100}
          height={100}
          className="rounded-xl w-full mx-auto object-cover"
          alt=""
        />
      </div>
      {/* 
      <div className="py-2">
        <h3 className="text-xl text-center mt-3  uppercase">NON-SUBSCRIBER</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="border-2 mt-2 !line-through max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            ${product.price.toFixed(2)}
          </div>
          <div className="border-2 mt-2 max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            ${discountedPrice}
          </div>
        </div>
      </div> */}

      <div className="py-2">
        <h3 className="text-xl text-center mt-3  uppercase">
          SUBSCRIBER PRICE
        </h3>
        <div className="border-2 mx-auto mt-2 max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
          ${discountedPriceForSubscribers}
        </div>

        {/* {product.isSaleSubscribers && (
          <h3 className="text-2xl sm:text-3xl text-green-400 text-center mt-6">
            {product.discountSubscribers}% Off
          </h3>
        )} */}

        <h3
          className="text-2xl cursor-pointer text-blue-500 underline text-center mt-3"
          onClick={perksModalOpenHandler}
        >
          Perks
        </h3>
      </div>

      <div className="py-2">
        <input
          name="email"
          type="text"
          placeholder="example@email.com"
          value={email}
          onChange={handleEmailChange}
          className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg px-4 my-1 py-2"
        />
      </div>

      <ButtonComponent
        rounded
        className="mt-5"
        full
        type="submit"
        onClick={handleSubscribe}
      >
        Subscribe to save
      </ButtonComponent>
    </div>
  );
}

export default Scan;
