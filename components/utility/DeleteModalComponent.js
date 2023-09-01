import { useState, useEffect } from "react";
import ModalComponent from "@/components/utility/Modal";


function ProductDetails({ children, title, onConfirmed }) {
    const [openModal, setOpenModal] = useState(false)

    const onDeleted = () => {
        setOpenModal(false)
        console.log(openModal)
        onConfirmed()
    }

    return (
        <div>
            <div onClick={() => setOpenModal(true)}>
                {children}
            </div>
            {
                openModal ?
                    <ModalComponent
                        open={openModal}
                        title="Delete confirmation"
                        onClose={() => setOpenModal(false)}
                        footer={
                            <div className="flex justify-end w-full">

                                <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => onDeleted()}>Delete</button>
                            </div>
                        }
                    >
                        <p className="text-xl">{title}</p>

                    </ModalComponent> : ""
            }
        </div>
    );
}

export default ProductDetails;