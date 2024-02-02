import { useState } from "react";
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from "react-notifications";
export default function ShareProduct() {
  const [openModal, setOpenModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://fashionpal.vercel.app/");
    NotificationManager.success("Link Copied!");
  };

  return (
    <div>
      <ModalComponent
        open={openModal}
        width="400px"
        title="Share FashionPal"
        onClose={() => setOpenModal(false)}
      >
        <div className="bg-gray-200 px-4 py-2 text-center text-gray-700 rounded-lg w-full">
          https://fashionpal.vercel.app/
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleCopy()}
            className="bg-primary px-5 py-2 rounded-xl text-white mb-2"
          >
            Copy url
          </button>
        </div>
      </ModalComponent>
      <div className="flex justify-center sm:mt-2 mt-3">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary px-5 py-2 rounded-xl text-white mb-2"
        >
          Share FashionPal
        </button>
      </div>
    </div>
  );
}
