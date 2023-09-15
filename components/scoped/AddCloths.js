import React, { useState } from "react";
import Image from "next/image";
import axios from 'axios';
import ButtonComponent from "@/components/utility/Button";
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
import ModalComponent from "@/components/utility/Modal";
import LoadingComponent from "../utility/loading";
import cloneDeep from "lodash.clonedeep";
import Compressor from 'compressorjs'
import EditTagsModalOffline from "@/components/utility/EditTagsModalOffline";
import ListingItem from "@/components/utility/ListingItem";
// 
const XIMILAR_API_TOKEN = process.env.NEXT_PUBLIC_XIMILAR_API_TOKEN;
console.log(process.env)
const dJSON = require('dirty-json');


function ImageUploader({ onBack, onFecth }) {
    const [image, setImage] = useState({ url: null, file: null });
    const [uploadedImages, setUploadedImages] = useState({
        main: null,
        brandTag: null,
    });
    const max_size = 5000000
    const max_size_words = '5 MB'

    const [listings, setListings] = useState([]);
    const [tagEditModal, setTagEditModal] = useState(false);
    const [activeTagIndex, setActiveTagIndex] = useState(0);
    const [editGeneratedTags, setEditGeneratedTags] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(0);

    const [type, setType] = useState('');

    const handleImageChange = (e) => {


        const file = e.target.files[0];
        compressImage(file)

    };
    const onNextToImageUploader = (e) => {


        if (!type) {
            alert('Type is required!')
            return
        }

        setStep(1)

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
    const triggerEditTagsModalOffline = (index) => {
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
    const handleListingImageDelete = (index, key) => {
        console.log(listings)
        console.log(index)
        console.log(key)
        let newListings = cloneDeep(listings)
        console.log(newListings)
        if (newListings[index] && newListings[index].items) {
            console.log(newListings[index].items[key])
            newListings[index].items[key] = null
            console.log(newListings[index].items[key])
        }
        console.log(newListings)
        if (key === 'main') {
            newListings.splice(index, 1)
        }

        if (newListings.length === 0) {
            setStep(2)
        }
        setListings(newListings);

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

        console.log(listings)
        console.log(uploadedImages)
        const newListing = listings
        newListing.push({
            tags: [],
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

    const compressImage = (file) => {
        // compress file
        const options = {
            quality: 0.6,
            maxWidth: 500,
            // quality: max_size / file.size,
            success: (compressedFile) => {
                console.log('compress success in...')
                const newFile = new File([compressedFile], file.name, {
                    type: compressedFile.type,
                })
                console.log(newFile)
                const blobURL = URL.createObjectURL(newFile);
                setImage({ url: blobURL, file: newFile, tag: '' });
                if (step === 1) {
                    setStep(2);
                }

            },
            error: (error) => {
                console.error(error.message)
            },
        }
        console.log(options)
        new Compressor(file, options)
    }

    const handleFinishListing = () => {

        console.log(listings)
        console.log(uploadedImages)
        const newListing = listings
        newListing.push({
            tags: [],
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

    const convertBlobToBase64 = async (blobUrl) => {
        const blob = await fetch(blobUrl).then(r => r.blob());
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result.split(',')[1]);  // Return only Base64 content
            };
            reader.readAsDataURL(blob);
        });
    };


    const getTagsFromXimilar = async (base64Image, imageType) => {
        if (imageType === "main") {

            // Define the Top Category and Category based on the type
            let topCategory = type; // Assuming the type matches the Top Category exactly
            let category; // Assuming a default category here, you can modify as needed

            switch (type) {
                case 'Footware':
                    category = 'Footware/Boots'; // Modify as per your requirement
                    break;
                case 'Clothing':
                    category = 'Clothing/Upper'; // Modify as per your requirement
                    break;
                case 'Hats':
                    category = 'Hats/Caps'; // Modify as per your requirement
                    break;
                default:
                    break;
            }

            const response = await axios.post('https://api.ximilar.com/tagging/fashion/v2/detect_tags', {
                relevance: 0.3,
                records: [{
                    _base64: base64Image,
                    'Top Category': topCategory,
                    Category: category
                }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${XIMILAR_API_TOKEN}`
                }
            });

            function getAllTags(data) {
                const tagsArray = [];

                data.forEach(item => {
                    const tags = item._tags;
                    for (const category in tags) {
                        tags[category].forEach(tag => {
                            tagsArray.push({
                                name: tag.name,
                                prob: tag.prob
                            });
                        });
                    }
                });

                return tagsArray;
            }

            const allTags = getAllTags(response.data.records[0]._objects);
            const allTagsFilter = allTags.map(tag => {
                return { name: tag.name, value: tag.prob, tagType: imageType };
            });
            console.log(allTagsFilter)
            return allTagsFilter
        }
        else if (imageType === "brandTag") {
            // Using Ximilar's OCR + GPT endpoint
            const response = await axios.post('https://api.ximilar.com/ocr/v2/read_gpt', {
                lang: "en",
                records: [{
                    _base64: base64Image,
                    prompt: "Please extract specific details from the provided text and create an array. Each entry in the array should consist of a name and its corresponding value. for example if image found brand or Made then should return this: {name: 'Made in', value: 'country here....'} {name: 'Brand', value: 'brand here.....'} ..."
                }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${XIMILAR_API_TOKEN}`
                }
            });
            const tags = dJSON.parse(response.data.records[0]._gpt.result)
            console.log(tags)
            // Return GPT's result directly
            return tags;
        }


        // else if (imageType === "brandTag") {
        //     // Using Ximilar's OCR endpoint
        //     const response = await axios.post('https://api.ximilar.com/ocr/v2/read', {
        //         lang: "en", // Change this as per your requirement
        //         records: [{
        //             _base64: base64Image
        //         }],
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Token ${XIMILAR_API_TOKEN}`
        //         }
        //     });

        //     // Parse the OCR response to get the text
        //     const ocrData = response.data.records[0]._ocr;




        //     // Return the OCR data as tags (or process further as needed)
        //     return [{ name: 'brand', value: ocrData.full_text }]
        // }
    };

    const triggerToTagsPage = async () => {
        const requests = [];

        for (let listing of listings) {
            const mainImageBase64 = await convertBlobToBase64(listing.items.main.image);
            requests.push(getTagsFromXimilar(mainImageBase64, 'main'));

            if (listing.items.brandTag && listing.items.brandTag.image) {
                const brandTagImageBase64 = await convertBlobToBase64(listing.items.brandTag.image);
                requests.push(getTagsFromXimilar(brandTagImageBase64, 'brandTag'));
            }
        }

        const responses = await axios.all(requests);
        console.log(responses)
        setListings(prevListings => {
            let responseIndex = 0;
            const updatedListings = prevListings.map(listing => {
                // Merge tags from 'main' and 'brandTag' (if present).
                listing.tags = [...responses[responseIndex]];
                console.log(listing.tags)
                responseIndex++;

                if (listing.items.brandTag && listing.items.brandTag.image) {
                    listing.tags = [...listing.tags, ...responses[responseIndex]];
                    console.log(listing.tags)
                    responseIndex++;
                }

                return listing;
            });

            return updatedListings;
        });

        // Execute the additional logic after updating the tags:
        if (editGeneratedTags) {
            setStep(6);
        } else {
            handleUploadAll();
        }
    };



    // const triggerToTagsPage = () => {
    //     if (editGeneratedTags) {
    //         setStep(6)
    //     } else {
    //         handleUploadAll()
    //     }
    // }

    const fileToBase64 = (file) => {
        console.log(file)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // split to get only Base64 value
            reader.onerror = error => reject(error);
        });
    }



    const handleUploadAll = async () => {
        setUploading(true);

        const convertedListings = await Promise.all(listings.map(async listing => {
            const mainImageBase64 = await fileToBase64(listing.items.main.file);
            const brandImageBase64 = listing.items.brandTag
                ? await fileToBase64(listing.items.brandTag.file)
                : null;

            return {
                mainImage: mainImageBase64,
                brandImage: brandImageBase64,
                type: type,
                tags: listing.tags,
            };
        }));

        try {
            const requests = convertedListings.map(listing =>
                axios.post('/api/add-listing', { listing })
            );

            const responses = await axios.all(requests);
            const results = responses.map(response => response.data);

            console.log(results);

            onFecth();
            alert('uploaded');
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
            onBack();
        }
    };



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
                    {step == 0 ?
                        <div className="mt-8">
                            <div className=" w-64">
                                <label>Category</label>
                                <select value={type} className="w-full mt-1 rounded-lg px-3 py-1.5 border border-gray-600" onChange={(e) => setType(e.target.value)}>
                                    <option value="" disabled>Select type</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Hats">Hats</option>
                                </select>
                            </div>
                            <div className="mt-3">
                                <ButtonComponent rounded className="!w-32 mt-6" onClick={onNextToImageUploader} >Next</ButtonComponent>
                            </div>
                        </div>
                        : ''
                    }
                    {[1, 2, 3, 4].includes(step) ?
                        <div className="w-72 mx-auto flex-shrink-0">
                            {!image.url && [1, 2, 3].includes(step) ? (
                                <label className="rounded-2xl mx-auto mt-8 cursor-pointer hover:opacity-70 flex items-center justify-center border-2 border-primary w-64 h-56">
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
                                        <div className="mt-8 mx-auto border-2 border-primary rounded-2xl px-4 py-10 w-64 relative">

                                            <Image src={image.url} alt="Uploaded preview" width={1} height={1} className="rounded w-full" />
                                            <DeleteModalComponent title='Are you sure you want to delete image?' onConfirmed={() => deleteImage()}>
                                                <button className="mt-4 bg-red-600 hover:bg-opacity-90 text-white font-bold py-1.5 absolute -top-2 right-2 z-10 px-1.5 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>

                                                </button>
                                            </DeleteModalComponent>
                                        </div>
                                    ) : ''}
                                    <div className="mt-4">
                                        {step === 2 ?
                                            <ButtonComponent full onClick={() => handleAdd('main')} className={`!my-2 mx-auto !w-64 rounded-lg  !text-black`}>Main Photo</ButtonComponent>
                                            : ''}
                                        {step === 3 ?
                                            <>

                                                <ButtonComponent disabled={!image.url} full onClick={() => handleAdd('brandTag')} className={`!my-2 mx-auto !w-64 rounded-lg !bg-green-600 !text-black`}>Brand Tag Photo</ButtonComponent>
                                                <ButtonComponent color="light" full onClick={() => setStep(4)} className={`!my-2 mx-auto !w-64 rounded-lg !text-black`}>Skip Brand Tag</ButtonComponent>
                                            </>
                                            : ''}
                                    </div>
                                </>) : ''}

                            {step === 4 ?
                                <>
                                    <div className="flex flex-wrap justify-center  mb-4">
                                        {uploadedImages.main ?
                                            <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={uploadedImages.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                </div>

                                                {/* <span className="bg-green-500 rounded-xl text-xs px-2 py-0.5 text-white">{uploadedImages.main.tag}</span> */}

                                                <DeleteModalComponent title='Are you sure you want to delete image?' onConfirmed={() => handleDelete('main')}>
                                                    <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </DeleteModalComponent>

                                            </div> : ''}
                                        {uploadedImages.brandTag ?
                                            <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={uploadedImages.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                </div>

                                                {/* <span className="bg-green-500 rounded-xl text-xs px-2 py-0.5 text-white">{uploadedImages.brandTag.tag}</span> */}
                                                <DeleteModalComponent title='Are you sure you want to delete image?' onConfirmed={() => handleDelete('brandTag')}>
                                                    <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 absolute top-2 right-2 z-10 px-1 rounded">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </DeleteModalComponent>

                                            </div> : ''}

                                    </div>
                                    <ButtonComponent color="secondary" full onClick={() => handleListMore()} className={`!my-2 mx-auto !w-64 rounded-lg !bg-green-600 !text-black`}>List More</ButtonComponent>
                                    <ButtonComponent full onClick={() => handleFinishListing()} className={`!my-2 mx-auto !w-64 rounded-lg !text-black`}>Finish Listing</ButtonComponent>
                                </>
                                : ''}
                        </div> : ''}


                    {step === 5 ?
                        <div className="px-5 mt-6 w-full">

                            <div className="">
                                {listings.map((row, rowIndex) => (
                                    <>
                                        <div key={rowIndex} className="flex flex-wrap justify-center sm:justify-start">
                                            {row.items.main ?
                                                <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                    <div className="w-full flex items-center justify-center">
                                                        <img src={row.items.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                    </div>



                                                </div> : ''}
                                            {row.items.brandTag ?
                                                <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                    <div className="w-full flex items-center justify-center">
                                                        <img src={row.items.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                    </div>



                                                </div> : ''}

                                        </div></>
                                ))}
                            </div>

                            {listings.length > 0 && (
                                <div className="mt-10 ml-3">

                                    <div className="flex justify-center sm:justify-start">
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
                                    </div>
                                    <div className="flex justify-center sm:justify-start">
                                        <ButtonComponent rounded className="!w-48" onClick={() => triggerToTagsPage()} >Generate Tags</ButtonComponent>
                                    </div>

                                </div>
                            )}
                        </div>
                        : ''}



                    {step === 6 ?
                        <div>
                            {listings.map((row, index) => (
                                <div key={index}>
                                    <div className="flex flex-wrap justify-center sm:justify-start">
                                        {row.items.main ?
                                            <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={row.items.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                </div>



                                            </div> : ''}
                                        {row.items.brandTag ?
                                            <div className="mx-1 border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={row.items.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                </div>


                                            </div>
                                            : ''}
                                    </div>
                                    {
                                        row.tags.map((tag, tagIndex) => (
                                            <div key={tagIndex} className="py-1 w-full items-center flex">
                                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.name} onChange={(e) => handleUpdateTagName(index, tagIndex, e.target.value)} />
                                                <input className="w-full mx-1 rounded-lg px-3 py-1.5 border border-gray-600" type="text" value={tag.value} onChange={(e) => handleUpdateTagValue(index, tagIndex, e.target.value)} />
                                                <DeleteModalComponent title='Are you sure you want to delete tag?' onConfirmed={() => handleDeleteTag(index, tagIndex)}>
                                                    <button className="bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>


                                                    </button>
                                                </DeleteModalComponent>
                                            </div>
                                        ))
                                    }
                                    <button className=" bg-[#FF9C75] px-4 py-1.5 mt-2 rounded-lg text-white" onClick={() => handleAddTag(index)}>Add Tag</button>
                                </div>
                            ))}
                            <div className="flex justify-center sm:justify-start">
                                <ButtonComponent rounded className="!w-48 !mt-6" onClick={() => setStep(7)} >Review All</ButtonComponent>
                            </div>
                        </div>

                        : ''
                    }

                    {
                        step === 7 ?
                            <>
                                <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">
                                    {listings.map((row, key) => {
                                        return (
                                            <ListingItem key={key} mainPhoto={row.items.main.image} tags={row.tags}>

                                                <button onClick={() => triggerEditTagsModalOffline(key)} className=" bg-lightprimary px-3 py-1 text-xs mt-1 rounded">
                                                    Edit Tags
                                                </button>
                                            </ListingItem>

                                        );
                                    })}
                                </div>
                                <div className="flex justify-center sm:justify-start">
                                    <ButtonComponent rounded className="!w-48 mt-6" onClick={handleUploadAll} >Upload All</ButtonComponent>
                                </div>
                            </> : ''
                    }
                    <EditTagsModalOffline
                        open={tagEditModal}
                        onClose={() => setTagEditModal(false)}
                        handleDeleteTag={(index) => handleDeleteTag(activeTagIndex, index)}
                        handleAddTag={() => handleAddTag(activeTagIndex)}
                        editTagName={(index, e) => handleUpdateTagName(activeTagIndex, index, e)}
                        editTagValue={(index, e) => handleUpdateTagValue(activeTagIndex, index, e)}
                        data={listings[activeTagIndex] && listings[activeTagIndex].tags}
                    />

                </div >
            ) :
                (
                    <div className="mt-16">

                        <LoadingComponent size='xl' />
                    </div>
                )

            }
        </div >
    );
}

export default ImageUploader;
