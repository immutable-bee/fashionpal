import { useState, useEffect } from "react";
import Image from 'next/image';
import ModalComponent from "@/components/utility/Modal";
function ProductDetails({ open, onClose, data }) {

    const [showAll, setShowAll] = useState(false);
    const tagsToDisplay = showAll ? data.tags : data.tags.slice(0, 3);

    const [activeImage, setActiveImage] = useState(0);
    return (

        <div>
            {
                open ?
                    <ModalComponent
                        open={open}
                        title="Details"
                        onClose={() => onClose()}
                        footer={
                            <div className="flex justify-end w-full">
                                <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => onClose()}>Close</button>
                            </div>
                        }
                    >
                        <div className="flex justify-center relative"> {/* relative to position arrows absolutely */}
                            {activeImage === 1 && (
                                <button
                                    onClick={() => setActiveImage(0)}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2"
                                >
                                    ←
                                </button>
                            )}
                            {activeImage === 1 ?
                                <Image
                                    src={data?.mainPhoto}
                                    className="rounded-lg w-full"
                                    width="150"
                                    height="150"
                                    alt=""
                                /> :
                                <Image
                                    src={data?.brandTagPhoto}
                                    className="rounded-lg w-full"
                                    width="150"
                                    height="150"
                                    alt=""
                                />}

                            {activeImage === 0 && (
                                <button
                                    onClick={() => setActiveImage(1)}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                                >
                                    →
                                </button>
                            )}
                        </div>
                        <h3 className="text-xl">Item Tags</h3>
                        {tagsToDisplay.map((tag, tagIndex) => (
                            <div
                                key={tagIndex}
                                className={`text-gray-800 font-light ${tagIndex % 2 === 0 ? 'bg-lightprimary' : 'bg-white'} rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                            >
                                <span className="w-1/2">{tag.name}:</span> <span className="w-1/2">{tag.value}</span>
                            </div>
                        ))}
                        {!showAll && data.tags.length > 3 && (
                            <button className=" bg-primary px-3 py-1 text-sm !mt-3 rounded-md text-white" onClick={() => setShowAll(true)}>View all</button>
                        )}

                        <div className="flex justify-center !mt-3">
                            <button className="bg-primary text-white px-5 py-1.5 rounded-lg">Save item</button>
                        </div>

                        <div className="flex items-center">
                            <Image
                                src={data?.brandTagPhoto}
                                className="w-28 rounded-full"
                                width="150"
                                height="150"
                                alt=""
                            />

                            <div className="ml-4">
                                <h3 className="text-base font-light">BiblioPal Inc.</h3>
                                <h3 className="text-base font-light">Naseer Complex, Miani Road, Sukkur, Pakistan</h3>
                                <a href="mailto:ibrahim@justibrahim.com" className="text-primary text-base font-light block hover:underline">ibrahim@justibrahim.com</a>
                                <a href="https://fashionpal.vercel.app/" className="text-primary text-base font-light block hover:underline">https://fashionpal.vercel.app/</a>
                            </div>
                        </div>



                    </ModalComponent> : ""
            }
        </div>
    );
}


export default ProductDetails;
