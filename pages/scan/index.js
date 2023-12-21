import { useState } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import { Modal } from "@nextui-org/react";

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
  const [isTCModalOpen, setIsTCModalOpen] = useState(false);

  const tcModalOpenHandler = () => {
    setIsTCModalOpen(true);
  };

  const tcModalCloseHandler = () => {
    setIsTCModalOpen(false);
  };
  return (
    <div className="sm:w-96 mx-auto mt-16">
      <Modal
        open={isTCModalOpen}
        closeButton
        onClose={tcModalCloseHandler}
      >
        <PerksModalContent />
      </Modal>
      <div className="bg-red-500 rounded-xl uppercase text-black text-center py-4 text-3xl">
        50% Sale
      </div>

      <div className=" border-2  mx-auto mt-8 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
        <Image
          src={
            "https://jhkrtmranrjztkixgfgf.supabase.co/storage/v1/object/public/standard-listings/05e56499-0cd1-4683-ad8e-1c24c9b977d4/clq52jr0s000kx4kjnvna75ry/brandImage        "
          }
          width={100}
          height={100}
          className="rounded-xl w-full  mx-auto object-cover"
          alt=""
        />
      </div>

      <div className="py-2">
        <h3 className="text-xl text-center mt-6 uppercase">NON-SUBSCRIBER</h3>
        <div className="flex items-center justify-center gap-2">
          <div className="border-2  mt-2 !line-through max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            $14.00
          </div>
          <div className="border-2  mt-2  max-w-fit py-1.5 border-yellow-500 rounded-2xl px-4 content-center text-2xl">
            $7.00
          </div>
        </div>
      </div>
      <div className="py-2">
        <h3 className="text-xl text-center mt-6 uppercase">SUBSCRIBER PRICE</h3>
        <div className="border-2 mx-auto mt-2 max-w-fit  py-1.5 border-black rounded-2xl px-4 content-center text-4xl">
          $10.00
        </div>

        <h3 className="text-3xl text-green-400 text-center mt-6 ">37% Off</h3>
        <h3
          className="text-base cursor-pointer text-blue-500 underline text-center mt-6 "
          onClick={tcModalOpenHandler}
        >
          perks
        </h3>
      </div>

      <div className="py-2">
        <input
          name="email"
          type="text"
          placeholder="example@email.com"
          className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
        />
      </div>
      <ButtonComponent
        rounded
        className="mt-5"
        full
        type="submit"
      >
        Subscribe to save
      </ButtonComponent>
    </div>
  );
}

export default Scan;
