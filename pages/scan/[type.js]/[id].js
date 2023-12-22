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
          <h1 className="text-lg">1. EXCLUSIVE SUBSCRIBER DISCOUNTS</h1>
          <h1 className="text-lg">2. ACCESS TO THE WEEKLY FIRST PEEK </h1>
          <h1 className="text-lg">3. NEWSLETTER</h1>
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
    <div className="sm:w-96 mx-auto mt-16 mb-10">
      <Modal
        open={isPerksModalOpen}
        closeButton
        onClose={perksModalCloseHandler}
      >
        <PerksModalContent />
      </Modal>

      {product.isSaleAllUsers && (
        <div className="bg-red-500 rounded-xl uppercase text-black text-center py-4 text-3xl">
          {product.discountAllUsers}% Off
        </div>
      )}

      <div className="border-2 mx-auto mt-8 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
        <Image
          src={product.mainImageUrl}
          width={100}
          height={100}
          className="rounded-xl w-full mx-auto object-cover"
          alt=""
        />
      </div>

      <div className="py-2">
        <h3 className="text-xl text-center mt-6 uppercase">NON-SUBSCRIBER</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="border-2 mt-2 !line-through max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            ${product.price.toFixed(2)}
          </div>
          <div className="border-2 mt-2 max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            ${discountedPrice}
          </div>
        </div>
      </div>

      <div className="py-2">
        <h3 className="text-xl text-center mt-6 uppercase">SUBSCRIBER PRICE</h3>
        <div className="border-2 mx-auto mt-2 max-w-fit py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
          ${discountedPriceForSubscribers}
        </div>

        {product.isSaleSubscribers && (
          <h3 className="text-3xl text-green-400 text-center mt-6">
            {product.discountSubscribers}% Off
          </h3>
        )}

        <h3
          className="text-base cursor-pointer text-blue-500 underline text-center mt-6"
          onClick={perksModalOpenHandler}
        >
          perks
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
