import { useState, useEffect } from "react";
import ModalComponent from "@/components/utility/Modal";

function ProductDetails({
  heading = "Delete confirmation",
  btnText = "Delete",
  children,
  title,
  onConfirmed,
}) {
  const [openModal, setOpenModal] = useState(false);

  const onDeleted = () => {
    setOpenModal(false);

    onConfirmed();
  };

  return (
    <div>
      <div onClick={() => setOpenModal(true)}>{children}</div>
      {openModal ? (
        <ModalComponent
          open={openModal}
          title={heading}
          onClose={() => setOpenModal(false)}
          footer={
            <div className="flex justify-end w-full">
              <button
                className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
                onClick={() => onDeleted()}
              >
                {btnText}
              </button>
            </div>
          }
        >
          <p className="text-xl">{title}</p>
        </ModalComponent>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProductDetails;
