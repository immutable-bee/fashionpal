import React, { useState } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
function ImageUploader({ onBack }) {
    const [image, setImage] = useState({ url: null, file: null });
    const [selectedTag, setSelectedTag] = useState(null);
    const [inputVisible, setInputVisible] = useState(true);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [editAfterUpload, setEditAfterUpload] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const blobURL = URL.createObjectURL(file);
        setImage({ url: blobURL, file });
        setSelectedTag(null);
        setInputVisible(false);
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
    };

    const handleAdd = () => {
        if (image.url && selectedTag) {
            setUploadedImages([...uploadedImages, { image: image.url, file: image.file, tag: selectedTag }]);
            setImage({ url: null, file: null });
            setSelectedTag(null);
            setInputVisible(true);
        }
    };

    const handleDelete = (index) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const handleUploadAll = () => {
        const formData = new FormData();

        uploadedImages.forEach((item, index) => {
            formData.append(`images[${index}]`, item.file);
            formData.append(`tags[${index}]`, item.tag);
        });

        // Replace with your actual API endpoint
        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                setUploadedImages([]); // Clear images after upload
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="flex max-w-7xl mx-auto">
            <div className="px-5 mt-6  w-72 flex-shrink-0">
                <div className="flex items-center">
                    <svg onClick={onBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <h3 className="ml-3 text-xl">
                        Add Cloth
                    </h3>
                </div>



                {inputVisible ? (
                    <label className="rounded-2xl mt-8 cursor-pointer hover:opacity-70 flex items-center justify-center border-2 border-black w-64 h-56">
                        <input type="file" accept="image/*" capture="user" className="sr-only" onChange={handleImageChange} />
                        <h1 className="text-5xl text-center font-semibold font-serif">Take a Photo</h1>
                    </label>
                ) : (
                    <>
                        <div className="mt-8 border-2 border-black rounded-2xl px-4 py-10 w-64 relative">
                            <Image src={image.url} alt="Uploaded preview" width={1} height={1} className="rounded w-full" />
                            <button onClick={handleDelete} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 absolute -top-2 right-2 z-10 px-1.5 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>

                            </button>
                        </div>
                        <div className="mt-4">
                            <ButtonComponent full onClick={() => handleTagClick("Main Photo")} className={`!my-1 rounded-lg ${selectedTag === "Main Photo" ? "!bg-green-500" : "!bg-white"} !text-black`}>Main Photo</ButtonComponent>
                            <ButtonComponent full onClick={() => handleTagClick("Brand Tag Photo")} className={`!my-1 rounded-lg ${selectedTag === "Brand Tag Photo" ? "!bg-green-500" : "!bg-white"} !text-black`}>Brand Tag Photo</ButtonComponent>
                            <ButtonComponent full onClick={() => handleTagClick("Front Photo")} className={`!my-1 rounded-lg ${selectedTag === "Front Photo" ? "!bg-green-500" : "!bg-white"} !text-black`}>Front Photo</ButtonComponent>
                            <ButtonComponent rounded full onClick={handleAdd} className="!mt-5">Add</ButtonComponent>
                        </div>
                    </>
                )}

            </div>

            <div className="px-5 mt-6 w-full">
                <div className="flex flex-wrap">
                    {uploadedImages.map((item, index) => (
                        <div key={index} className=" p-2 w-56 bg-white rounded-xl m-1">
                            <div className="w-full h-32 flex items-center justify-center">
                                <img src={item.image} alt={item.tag} className="rounded max-w-full max-h-full" />
                            </div>
                            <div className="flex justify-between pt-2 px-2 items-center">
                                <span className="bg-green-500 rounded-xl text-xs px-2 py-0.5 text-white">{item.tag}</span>
                                <button onClick={() => handleDelete(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {uploadedImages.length > 0 && (
                    <div className="mt-10 ml-3">
                        <label className="relative mb-4 flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                checked={editAfterUpload}
                                onChange={() => setEditAfterUpload(!editAfterUpload)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2EAAED]"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Edit after upload?
                            </span>

                        </label>
                        <ButtonComponent rounded className="!w-48" onClick={handleUploadAll} >Upload All</ButtonComponent>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUploader;
