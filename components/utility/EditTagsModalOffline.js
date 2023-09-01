import { useState, useEffect } from "react";
import Image from 'next/image';
import ModalComponent from "@/components/utility/Modal";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
function ProductDetails({ open, onClose, data, handleDeleteTag, handleAddTag, editTagName, editTagValue }) {

    return (

        <div>
            {
                open ?
                    <ModalComponent
                        open={open}
                        title="Edit Tags"
                        onClose={() => onClose()}
                        footer={
                            <div className="flex justify-end w-full">

                                <button className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => onClose()}>Close</button>
                            </div>
                        }
                    >
                        {data.map((tag, tagIndex) => (
                            <div key={tagIndex} className="py-1 w-full items-center flex !mt-1">
                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.name} onInput={(e) => editTagName(tagIndex, e.target.value)} />
                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.value} onInput={(e) => editTagValue(tagIndex, e.target.value)} />
                                <DeleteModalComponent title='Are you sure you want to delete image?' onConfirmed={() => handleDeleteTag(tagIndex)}>
                                    <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>


                                    </button>
                                </DeleteModalComponent>
                            </div>
                        ))}
                        <button className=" bg-[#FF9C75] px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => handleAddTag()}>Add Tag</button>

                    </ModalComponent> : ""
            }
        </div>
    );
}


export default ProductDetails;
