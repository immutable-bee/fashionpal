import React, { useState } from "react";
import Image from "next/image";
import ButtonComponent from "@/components/utility/Button";
import ModalComponent from "@/components/utility/Modal";
import LoadingComponent from "../utility/loading";
import cloneDeep from "lodash.clonedeep";
function ImageUploader({ onBack }) {
    const [image, setImage] = useState({ url: null, file: null });
    const [uploadedImages, setUploadedImages] = useState({
        main: null,
        brandTag: null,
    });
    const [listings, setListings] = useState([]);
    const [tagEditModal, setTagEditModal] = useState(false);
    const [activeTagIndex, setActiveTagIndex] = useState(0);
    const [editAfterUpload, setEditAfterUpload] = useState(false);
    const [editGeneratedTags, setEditGeneratedTags] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1);

    const handleImageChange = (e) => {


        const file = e.target.files[0];
        const blobURL = URL.createObjectURL(file);
        setImage({ url: blobURL, file, tag: '' });
        if (step === 1) {
            setStep(2);
        }
    };
    const deleteImage = (e) => {



        setImage({ url: null, file: null });


    };


    const handleAdd = (key) => {
        if (image.url && key) {
            let newUploadedImages = uploadedImages
            newUploadedImages[key] = { image: image.url, file: image.file }
            setUploadedImages(newUploadedImages);
            setImage({ url: null, file: null });
            setStep(step === 2 ? 3 : 4)
        }
    };
    const triggerEditTagsModal = (index) => {
        setTagEditModal(true)
        setActiveTagIndex(index)
    };

    const handleDelete = (key) => {
        console.log(key)
        let newUploadedImages = cloneDeep(uploadedImages)
        console.log(newUploadedImages)
        newUploadedImages[key] = null
        console.log(newUploadedImages)
        setUploadedImages(newUploadedImages);
        if (key === 'main') {
            setStep(2)
        }
    };

    const handleImageDeleteInListing = (index, key) => {
        console.log(key)
        let newListing = cloneDeep(listings)
        console.log(newListing)
        if (key === 'main') {
            newListing.splice(index, 1)
            if (newListing.length === 0) {
                setStep(2)
            }
        } else {
            newListing[index].items[key] = null
        }


        setListings(newListing);

    };

    const handleListMore = () => {
        const defaultTags = [
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
        ];
        console.log(listings)
        console.log(uploadedImages)
        const newListing = listings
        newListing.push({
            tags: defaultTags,
            items: uploadedImages
        })
        console.log(newListing)
        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setStep(1);
        setTimeout(() => {
            console.log(listings)
        }, 100);

        // Add your additional functionality here
        // For example:
        // alert('Listed more items successfully!');
    };

    const handleFinishListing = () => {
        const defaultTags = [
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
            { name: 'size', value: 'medium' },
            { name: 'sleeve length', value: 'short' },
            { name: 'color', value: 'pink' },
        ];
        console.log(listings)
        console.log(uploadedImages)
        const newListing = listings
        newListing.push({
            tags: defaultTags,
            items: uploadedImages
        })
        console.log(newListing)
        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setStep(5);
        console.log(step)
        setTimeout(() => {
            console.log(listings)
        }, 100);

        // Add your additional functionality here
        // For example:
        // alert('Finished listing items!');
    };

    const triggerToTagsPage = () => {
        if (editGeneratedTags) {
            setStep(6)
        } else {
            handleUploadAll()
        }
    }




    const handleUploadAll = () => {
        setUploading(true)

        setTimeout(() => {
            alert('uploaded')
            setUploading(false)
            onBack()
        }, 5000);

        // const formData = new FormData();
        // listings.flat().forEach((item, index) => {
        //     formData.append(`images[${index}]`, item.file);
        //     formData.append(`tags[${index}]`, item.tag);
        // });

        // // Replace with your actual API endpoint
        // fetch('/api/upload', {
        //     method: 'POST',
        //     body: formData,
        // })
        //     .then((response) => response.json())
        //     .then((result) => {
        //         console.log('Success:', result);
        //         setListings([[]]); // Clear listings after upload
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
    }

    const handleDeleteTag = (listingIndex, tagIndex) => {
        console.log(listingIndex, tagIndex)
        const newListing = cloneDeep(listings)
        console.log(newListing)
        newListing[listingIndex].tags.splice(tagIndex, 1);
        console.log(newListing)
        setListings(newListing);
    }

    const handleAddTag = (listingIndex) => {
        const newTag = {
            name: "",  // or some default value
            value: ""  // or some default value
        };
        const newListing = [...listings];
        newListing[listingIndex].tags.push(newTag);
        setListings(newListing);
    }

    const handleUpdateTagName = (listingIndex, tagIndex, newValue) => {
        const newListing = [...listings];
        newListing[listingIndex].tags[tagIndex].name = newValue;
        setListings(newListing);
    }

    const handleUpdateTagValue = (listingIndex, tagIndex, newValue) => {
        const newListing = [...listings];
        newListing[listingIndex].tags[tagIndex].value = newValue;
        setListings(newListing);
    }



    return (
        <div className="max-w-7xl mx-auto px-5 pt-6">
            <div className="flex items-center">
                <svg onClick={onBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <h3 className="ml-3 text-2xl">
                    Add listing
                </h3>
            </div>
            {!uploading ? (
                <div className="">
                    {[1, 2, 3, 4].includes(step) ?
                        <div className="w-72 flex-shrink-0">
                            {!image.url && [1, 2, 3].includes(step) ? (
                                <label className="rounded-2xl mt-8 cursor-pointer hover:opacity-70 flex items-center justify-center border-2 border-black w-64 h-56">
                                    <div>
                                        <input type="file" accept="image/*" capture="user" className="sr-only" onChange={handleImageChange} />
                                        <h1 className="text-3xl text-center font-medium font-mono ">Take a Photo</h1>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 mt-4 mx-auto">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                    </div>

                                </label>) : ''}
                            {step !== 1 && step !== 4 ? (
                                <>
                                    {image.url ? (
                                        <div className="mt-8 border-2 border-black rounded-2xl px-4 py-10 w-64 relative">

                                            <Image src={image.url} alt="Uploaded preview" width={1} height={1} className="rounded w-full" />

                                            <button onClick={deleteImage} className="mt-4 bg-red-600 hover:bg-opacity-90 text-white font-bold py-1.5 absolute -top-2 right-2 z-10 px-1.5 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>

                                            </button>
                                        </div>
                                    ) : ''}
                                    <div className="mt-4">
                                        {step === 2 ?
                                            <ButtonComponent full onClick={() => handleAdd('main')} className={`!my-2 !w-64 rounded-lg  !text-black`}>Main Photo</ButtonComponent>
                                            : ''}
                                        {step === 3 ?
                                            <>
                                                <ButtonComponent full onClick={() => handleAdd('brandTag')} className={`!my-2 !w-64 rounded-lg !bg-green-600 !text-black`}>Brand Tag Photo</ButtonComponent>
                                                <ButtonComponent color="light" full onClick={() => setStep(4)} className={`!my-2 !w-64 rounded-lg !text-black`}>Skip Brand Tag</ButtonComponent>
                                            </>
                                            : ''}
                                    </div>
                                </>) : ''}

                            {step === 4 ?
                                <>
                                    <div className="flex flex-wrap mb-4">
                                        {uploadedImages.main ?
                                            <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                <div className="w-full h-32 flex items-center justify-center">
                                                    <img src={uploadedImages.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                </div>

                                                {/* <span className="bg-green-500 rounded-xl text-xs px-2 py-0.5 text-white">{uploadedImages.main.tag}</span> */}
                                                <button onClick={() => handleDelete('main')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>

                                            </div> : ''}
                                        {uploadedImages.brandTag ?
                                            <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                <div className="w-full h-32 flex items-center justify-center">
                                                    <img src={uploadedImages.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                </div>

                                                {/* <span className="bg-green-500 rounded-xl text-xs px-2 py-0.5 text-white">{uploadedImages.brandTag.tag}</span> */}
                                                <button onClick={() => handleDelete('brandTag')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>

                                            </div> : ''}

                                    </div>
                                    <ButtonComponent color="secondary" full onClick={() => handleListMore()} className={`!my-1 rounded-lg !bg-green-600 !text-black`}>List More</ButtonComponent>
                                    <ButtonComponent full onClick={() => handleFinishListing()} className={`!my-1 rounded-lg !text-black`}>Finish Listing</ButtonComponent>
                                </>
                                : ''}
                        </div> : ''}


                    {step === 5 ?
                        <div className="px-5 mt-6 w-full">

                            <div className="">
                                {listings.map((row, rowIndex) => (
                                    <>
                                        <div key={rowIndex} className="flex flex-wrap">
                                            {row.items.main ?
                                                <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                    <div className="w-full h-32 flex items-center justify-center">
                                                        <img src={row.items.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                    </div>


                                                    <button onClick={() => handleDelete('main')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>

                                                </div> : ''}
                                            {row.items.brandTag ?
                                                <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                    <div className="w-full h-32 flex items-center justify-center">
                                                        <img src={row.items.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                    </div>


                                                    <button onClick={() => handleDelete('brandTag')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>

                                                </div> : ''}

                                        </div></>
                                ))}
                            </div>

                            {listings.length > 0 && (
                                <div className="mt-10 ml-3">


                                    <label className="relative mb-4 flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value=""
                                            className="sr-only peer"
                                            checked={editGeneratedTags}
                                            onChange={() => setEditGeneratedTags(!editGeneratedTags)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Edit generated tags?
                                        </span>

                                    </label>
                                    <ButtonComponent rounded className="!w-48" onClick={() => triggerToTagsPage()} >Generate Tags</ButtonComponent>

                                </div>
                            )}
                        </div>
                        : ''}



                    {step === 6 ?
                        <div>
                            {listings.map((row, index) => (
                                <div key={index}>
                                    <div className="flex flex-wrap">
                                        {row.items.main ?
                                            <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                <div className="w-full h-32 flex items-center justify-center">
                                                    <img src={row.items.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                </div>


                                                <button onClick={() => handleImageDeleteInListing(index, 'main')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>

                                            </div> : ''}
                                        {row.items.brandTag ?
                                            <div className=" p-2 w-56 bg-white rounded-xl m-1 relative">
                                                <div className="w-full h-32 flex items-center justify-center">
                                                    <img src={row.items.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                </div>


                                                <button onClick={() => handleImageDeleteInListing(index, 'brandTag')} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                            : ''}
                                    </div>
                                    {
                                        row.tags.map((tag, tagIndex) => (
                                            <div key={tagIndex} className="py-1 w-full items-center flex">
                                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.name} onChange={(e) => handleUpdateTagName(index, tagIndex, e.target.value)} />
                                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.value} onChange={(e) => handleUpdateTagValue(index, tagIndex, e.target.value)} />
                                                <button onClick={() => handleDeleteTag(index, tagIndex)} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>


                                                </button>
                                            </div>
                                        ))
                                    }
                                    <button className=" bg-[#FF9C75] px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => handleAddTag(index)}>Add Tag</button>
                                </div>
                            ))}
                            <ButtonComponent rounded className="!w-48 !mt-6" onClick={() => setStep(7)} >{editAfterUpload ? 'Next' : 'Upload All'}</ButtonComponent>
                        </div>

                        : ''
                    }

                    {
                        step === 7 ?
                            <>
                                <div className="sm:flex flex-wrap mt-4 items-center">
                                    {listings.map((row, index) => {
                                        return (
                                            <div
                                                className="px-2 py-2 relative rounded-lg border sm:mx-2 my-2 sm:my-2 w-full sm:w-96 border-[#2eaaed]"
                                                key={row.id}
                                            >
                                                <div className="flex">
                                                    <div className="w-36 my-auto flex-shrink-0 mr-3 rounded-lg">
                                                        <img
                                                            src={row.items.main.image} alt={'Main Photo'}
                                                            className="rounded"
                                                        />
                                                    </div>
                                                    <div className="w-full mb-3 ">
                                                        <div className=" h-36 overflow-y-auto">
                                                            {row.tags.map((tag, tagIndex) => (
                                                                <p key={tagIndex} className="text-gray-800 text-base leading-5">
                                                                    {tag.name}: {tag.value}
                                                                </p>
                                                            ))}
                                                        </div>

                                                        <button onClick={() => triggerEditTagsModal(index)} className=" bg-lightprimary px-3 py-1 text-xs mt-1 rounded">
                                                            Edit Tags
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <ButtonComponent rounded className="!w-48 mt-6" onClick={handleUploadAll} >Upload All</ButtonComponent>
                            </> : ''
                    }
                    {
                        tagEditModal ?
                            <ModalComponent
                                open={tagEditModal}
                                title="Edit Tags"
                                onClose={() => setTagEditModal(false)}
                                footer={
                                    <div className="flex justify-end w-full">

                                        <button className=" bg-[#FF9C75] px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => setTagEditModal(false)}>Close</button>
                                    </div>
                                }
                            >
                                {listings[activeTagIndex].tags.map((tag, tagIndex) => (
                                    <div key={tagIndex} className="py-1 w-full items-center flex !mt-1">
                                        <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.name} onChange={(e) => handleUpdateTagName(activeTagIndex, tagIndex, e.target.value)} />
                                        <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.value} onChange={(e) => handleUpdateTagValue(activeTagIndex, tagIndex, e.target.value)} />
                                        <button onClick={() => handleDeleteTag(activeTagIndex, tagIndex)} className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>


                                        </button>
                                    </div>
                                ))}
                                <button className=" bg-[#FF9C75] px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => handleAddTag(activeTagIndex)}>Add Tag</button>

                            </ModalComponent> : ""
                    }
                </div >
            ) :
                (
                    <div className="mt-12">
                        <h3 className="text-center">36%</h3>
                        <LoadingComponent size='xl' />
                    </div>
                )

            }
        </div >
    );
}

export default ImageUploader;
