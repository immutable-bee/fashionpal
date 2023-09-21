import { useState, useEffect } from "react";
import Image from 'next/image';
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from 'react-notifications';
import Link from "next/link";
function ProductDetails({ open, onClose, data, fetchListings, imageOnly = false }) {
    console.log(data)
    const [showAll, setShowAll] = useState(false);
    const tagsToDisplay = showAll ? data?.tags : data?.tags.slice(0, 3);
    const [saveLoading, setLoadingSave] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const onSave = async () => {
        setLoadingSave(true);

        try {
            const res = await fetch(`/api/edit-listing`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data.id,
                    matches: data.matches
                })
            });

            if (res.status === 200) {
                NotificationManager.success('Listing saved successfully!')
                fetchListings()

            } else {
                const errorMessage = await res.text();
                console.error(`edit failed with status: ${res.status}, message: ${errorMessage}`);
            }
        } catch (error) {
            console.error('An error occurred while edit listing:', error);
        } finally {
            setLoadingSave(false);
        }
    };
    return (

        <div>
            {
                open ?
                    <ModalComponent
                        open={open}
                        title={imageOnly ? 'Full view' : 'Details'}
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
                                    className="absolute text-3xl left-0 top-1/2 transform -translate-y-1/2"
                                >
                                    ←
                                </button>
                            )}
                            {activeImage === 0 ?
                                <Image
                                    src={data?.mainImage?.url}
                                    className="rounded-lg w-full"
                                    width="150"
                                    height="150"
                                    alt=""
                                /> :
                                <Image
                                    src={data?.brandImage?.url}
                                    className="rounded-lg w-full"
                                    width="150"
                                    height="150"
                                    alt=""
                                />}

                            {data?.brandImage && data?.brandImage?.url && activeImage === 0 && (
                                <button
                                    onClick={() => setActiveImage(1)}
                                    className="absolute text-3xl right-0 top-1/2 transform -translate-y-1/2"
                                >
                                    →
                                </button>
                            )}
                        </div>
                        {!imageOnly ?
                            <div>
                                <h3 className="text-xl">Item Tags</h3>
                                {tagsToDisplay.map((tag, tagIndex) => (
                                    <div
                                        key={tagIndex}
                                        className={`text-gray-800 font-light ${tagIndex % 2 === 0 ? 'bg-lightprimary' : 'bg-white'} rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                    >
                                        <span className="w-1/2">{tag}</span>
                                    </div>
                                ))}
                                {!showAll && data?.tags.length > 3 && (
                                    <button className=" bg-primary px-3 py-1 text-sm !mt-3 rounded-md text-white" onClick={() => setShowAll(true)}>View all</button>
                                )}
                                {!data.matches ? (
                                    <div className="flex justify-center !mt-3">
                                        <button onClick={() => onSave()} className={`bg-primary text-white px-5 py-1.5 rounded-lg ${saveLoading ? "opacity-70 pointer-events-none" : ""}`}>Save item</button>
                                    </div>
                                ) : ''}

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

                                <div className="flex justify-center !mt-3">
                                    <Link href="/store/id">
                                        <button className="bg-primary text-white px-5 py-1.5 rounded-lg">View store</button>
                                    </Link>
                                </div>
                            </div> : ''}


                    </ModalComponent> : ""
            }
        </div>
    );
}


export default ProductDetails;
