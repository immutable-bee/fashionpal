import React, { useState, useRef, useEffect } from "react";
import { NotificationManager } from 'react-notifications';
import Image from "next/image";
import TooltipComponent from "@/components/utility/Tooltip";
import axios from 'axios';
import ButtonComponent from "@/components/utility/Button";
import ImageCropper from "@/components/utility/ImageCropper";
import Capture from "@/components/utility/Capture";
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
import LoadingComponent from "../utility/loading";
import cloneDeep from "lodash.clonedeep";
import Compressor from 'compressorjs'
import EditTagsModalOffline from "@/components/utility/EditTagsModalOffline";
import ListingItem from "@/components/utility/ListingItem";
import moment from "moment";


function ImageUploader({ onBack, onFecth }) {

    const [price, setPrice] = useState(0)
    const [retailPrice, setRetailPrice] = useState(0)
    const [auctionFloorPrice, setAuctionFloorPrice] = useState(0)
    const [auctionMaxPrice, setAuctionMaxPrice] = useState(0)
    const [floorPrice, setFloorPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [dataSource, setDataSource] = useState('')
    const [isOptionToAuction, setIsOptionToAuction] = useState(false)
    const [isViewSimilarListings, setIsViewSimilarListings] = useState(false)
    const [isOptionToEdit, setIsOptionToEdit] = useState(false)
    const [isGenerateSKULabels, setIsGenerateSKULabels] = useState(false)
    const [isIncludeRetailPrice, setIsIncludeRetailPrice] = useState(false)
    const [isAuctioned, setIsAuctioned] = useState(false)
    const [fetchingSimilarProducts, setFetchingSimilarProducts] = useState(false)
    const [auctionTime, setAuctionTime] = useState(24)
    const [delivery, setDelivery] = useState('')
    const [similarProducts, setSimilarProducts] = useState([])
    const [employeeName, setEmployeeName] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);

    const [listType, setListType] = useState('dispose');
    const [subCategoryOne, setSubCategoryOne] = useState('');
    const [subCategoryTwo, setSubCategoryTwo] = useState('');

    const [type, setType] = useState('simple');
    const [tagFetching, setTagFetching] = useState(false)

    const subCategoryOptionsClothing = [
        { name: "Men's Wear", value: "mens_wear" },
        { name: "Women's Wear", value: "womens_wear" },
        { name: "Kid's Wear", value: "kids_wear" },
        { name: "Activewear", value: "activewear" },
        { name: "Formal Wear", value: "formal_wear" },
    ];

    const subCategoryOptionsFootwear = [
        { name: "Running Shoes", value: "running_shoes" },
        { name: "Sandals", value: "sandals" },
        { name: "Boots", value: "boots" },
        { name: "Formal Shoes", value: "formal_shoes" },
        { name: "Heels", value: "heels" },


    ];
    const subCategoryOptionsHats = [
        { name: "Baseball Caps", value: "baseball_caps" },
        { name: "Beanies", value: "beanies" },
        { name: "Fedora", value: "fedora" },
        { name: "Sun Hats", value: "sun_hats" },
        { name: "Berets", value: "berets" },
    ];

    const subCategoryOptionsTwoClothing = [
        { name: "Winter Collection", value: "winter_collection" },
        { name: "Summer Collection", value: "summer_collection" },
        { name: "Fall Collection", value: "fall_collection" },
    ];
    const subCategoryOptionsTwoFootwear = [
        { name: "Sneakers Edition", value: "sneakers_edition" },
        { name: "Formal Edition", value: "formal_edition" },
        { name: "Limited Edition", value: "limited_edition" },

    ];
    const subCategoryOptionsTwoHats = [
        { name: "Vintage Hats", value: "vintage_hats" },
        { name: "Modern Caps", value: "modern_caps" },
        { name: "Special Edition", value: "special_edition" },
    ];

    const resetAllVariables = () => {
        setPrice(0);
        setRetailPrice(0);
        setAuctionFloorPrice(0);
        setAuctionMaxPrice(0);
        setFloorPrice(0);
        setMaxPrice(0);
        setStartTime('');
        setEndTime('');
        setDataSource('');
        setIsOptionToAuction(false);
        setIsViewSimilarListings(false);
        setIsOptionToEdit(false);
        setIsGenerateSKULabels(false);
        setIsIncludeRetailPrice(false);
        setIsAuctioned(false);
        setFetchingSimilarProducts(false);
        setAuctionTime(24);
        setDelivery('');
        setSimilarProducts([]);
        setEmployeeName('');
        setCategory('');
        setTags([]);
        setListType('dispose');
        setSubCategoryOne('');
        setSubCategoryTwo('');
    };




    const computedCategoryOne = () => {
        if (category === "Hats") {
            return subCategoryOptionsHats;
        } else if (category === "Clothing") {
            return subCategoryOptionsClothing;
        } else if (category === "Footwear") {
            return subCategoryOptionsFootwear;
        }
        return []; // or some default value
    }

    const computedCategoryTwo = () => {
        if (category === "Hats") {
            return subCategoryOptionsTwoHats;
        } else if (category === "Clothing") {
            return subCategoryOptionsTwoClothing;
        } else if (category === "Footwear") {
            return subCategoryOptionsTwoFootwear;
        }
        return []; // or some default value
    }


    const results = [
        { price: '59.99' },
        { price: '29.99' },
        { price: '19.99' }
    ]

    const [activeResultIndex, setActiveResultIndex] = useState(0)








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

    const [cropImage, setCropImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);


    const [currentPhotoType, setCurrentPhotoType] = useState('main');

    const fileInputRef = useRef(null);


    const compressMainAndBrandImage = (file) => {
        const options = {
            quality: 0.6,
            maxWidth: 500,
            success: (compressedFile) => {
                const newFile = new File([compressedFile], file.name, {
                    type: compressedFile.type,
                });
                const blobURL = URL.createObjectURL(newFile);
                if (type === 'main') {
                    setUploadedImages(prevState => ({
                        ...prevState,
                        main: { image: blobURL, file: newFile, type: "main" }
                    }));
                } else if (type === 'brandTag') {
                    setUploadedImages(prevState => ({
                        ...prevState,
                        brandTag: { image: blobURL, file: newFile, type: "brandTag" }
                    }));
                }
            },
            error: (error) => {
                console.error(error.message);
            },
        };
        new Compressor(file, options);
    };



    // 

    useEffect(() => {
        setStartTime(moment().format('HH:mm:ss'))
    }, []);

    const [showCamera, setShowCamera] = useState(false); // Control the visibility of the camera

    const changeTagsAdmin = (e) => {
        setUploadedImages((prevState) => ({
            ...prevState,
            tags: e, // Update 'tags' with combined tags from both 'main' and 'brandTag'
        }));
    }

    const capture = async (e) => {
        const imageSrc = e
        if (imageSrc) {
            const file = dataURLtoFile(imageSrc, `${currentPhotoType}.jpg`);

            // Set loading to true while uploading
            setImageUploading(true);

            try {
                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: currentPhotoType === 'main' ? 'mainImage' : 'brandImage', // Use the currentPhotoType as the image type
                        image: imageSrc.split(',')[1], // Base64 image data
                    }),
                });

                if (response.ok) {
                    const data = await response.json();


                    if (currentPhotoType === 'main') {
                        // Set main image in the uploadedImages state
                        setUploadedImages((prevState) => ({
                            ...prevState,
                            main: { image: imageSrc, file: file, type: "main", url: data.url },
                        }));
                        setCurrentPhotoType('brandTag');
                    } else if (currentPhotoType === 'brandTag') {
                        // Set brandTag image in the uploadedImages state
                        setUploadedImages((prevState) => ({
                            ...prevState,
                            brandTag: { image: imageSrc, file: file, type: "brandTag", url: data.url },
                        }));
                        // After capturing the brandTag image:
                        setShowCamera(false); // Hide the camera
                        setStep(2); // Move to the next step


                        const tags = [];

                        if (uploadedImages.main && uploadedImages.main.url) {
                            const mainTags = await getTagsFromGoogleVision(uploadedImages.main.url, 'main');
                            tags.push(...mainTags);
                        }

                        if (uploadedImages.brandTag && uploadedImages.brandTag.url) {
                            const brandTagTags = await getTagsFromGoogleVision(uploadedImages.brandTag.url, 'brandTag');
                            tags.push(...brandTagTags);
                        }

                        setUploadedImages((prevState) => ({
                            ...prevState,
                            tags: tags, // Update 'tags' with combined tags from both 'main' and 'brandTag'
                        }));

                    }

                } else {
                    // Handle the case when the upload was not successful
                    console.error('Image upload failed.');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                // Set loading back to false after the upload is complete
                setImageUploading(false);
            }
        }
    };


    // const capture = () => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     if (imageSrc) {
    //         const file = dataURLtoFile(imageSrc, `${currentPhotoType}.jpg`);
    //         compressMainAndBrandImage(file);

    //         if (currentPhotoType === 'main') {
    //             // Set main image in the uploadedImages state
    //             setUploadedImages(prevState => ({
    //                 ...prevState,
    //                 main: { image: imageSrc, file: file, type: "main" }
    //             }));
    //             setCurrentPhotoType('brandTag');
    //         } else if (currentPhotoType === 'brandTag') {
    //             // Set brandTag image in the uploadedImages state
    //             setUploadedImages(prevState => ({
    //                 ...prevState,
    //                 brandTag: { image: imageSrc, file: file, type: "brandTag" }
    //             }));
    //             // After capturing the brandTag image:
    //             setShowCamera(false); // Hide the camera

    //             setStep(2); // Move to the next step


    //         }
    //     }
    // };



    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleMainAndBrandImage = (e) => {
        const file = e.target.files[0];
        compressMainAndBrandImage(file);
        e.target.value = null; // Reset the file input

        // If it's the main image that was captured, automatically prompt to capture the brandTag image.
        if (currentPhotoType === 'main') {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }

    };





    // 


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        compressImage(file);
    };

    const compressImage = (file) => {
        const options = {
            quality: 0.6,
            maxWidth: 500,
            success: (compressedFile) => {
                const newFile = new File([compressedFile], file.name, {
                    type: compressedFile.type,
                });
                const blobURL = URL.createObjectURL(newFile);
                // setImage({ url: blobURL, file: newFile });
                setCropImage({ url: blobURL, file: newFile });
                setShowModal(true);
            },
            error: (error) => {
                console.error(error.message);
            },
        };
        new Compressor(file, options);
    };

    const handleCrop = (e) => {
        setImage(e);
        setShowModal(false);
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
            newUploadedImages[key] = { image: image.url, file: image.file, type: image.type }
            setUploadedImages(newUploadedImages);
            setImage({ url: null, file: null });
            setStep(step === 2 ? 3 : 4)
        }
    };

    const triggerEditTagsModalOffline = (index) => {
        setTagEditModal(true)
        setActiveTagIndex(index)
    };
    const onManageTags = () => {
        setTagEditModal(true)
    };

    const handleDelete = (key) => {

        let newUploadedImages = cloneDeep(uploadedImages)

        newUploadedImages[key] = null

        setUploadedImages(newUploadedImages);
        if (key === 'main') {
            setStep(2)
        }
    };
    const handleListingImageDelete = (index, key) => {



        let newListings = cloneDeep(listings)

        if (newListings[index] && newListings[index].items) {

            newListings[index].items[key] = null

        }

        if (key === 'main') {
            newListings.splice(index, 1)
        }

        if (newListings.length === 0) {
            setStep(2)
        }
        setListings(newListings);

    };

    const fetchSimilarProducts = async () => {
        setFetchingSimilarProducts(true)
        try {
            const url = `/api/getSimilarProducts?url=${uploadedImages.main.url}`;

            const response = await fetch(url);
            setFetchingSimilarProducts(false)
            if (response.ok) {
                const data = await response.json();
                setSimilarProducts(data);
            } else {
                console.error('Failed to fetch similar products:', response.status, response.statusText);
            }
        } catch (error) {
            setFetchingSimilarProducts(false)
            console.error('An error occurred while fetching similar products:', error);
        }
    };










    const handleEmployeeListMore = () => {


        const newListing = listings
        newListing.push({
            employee_name: employeeName,
            type: type,
            list_type: listType,
            tags: [],
            items: uploadedImages
        })

        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setCurrentPhotoType('main');
        setStep(1);
        resetAllVariables()

    };

    const handleAdminListMore = () => {


        const newListing = listings
        newListing.push({
            type: type,
            list_type: listType,
            tags: [],
            items: uploadedImages
        })

        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setCurrentPhotoType('main');
        setStep(1);
        resetAllVariables()
    };

    const handleListMore = () => {



        const newListing = listings
        newListing.push({
            tags: [],
            items: uploadedImages
        })

        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setStep(1);
        setTimeout(() => {

        }, 100);


    };



    const handleFinishListing = () => {



        const newListing = listings
        newListing.push({
            tags: [],
            items: uploadedImages
        })

        setListings(newListing);
        setUploadedImages({
            main: null,
            brandTag: null,
        });
        setStep(5);

        setTimeout(() => {

        }, 100);


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


    // This function will send the image to the server-side endpoint for processing.
    const getTagsFromGoogleVision = async (base64Image, imageType) => {
        setTagFetching(true)
        try {
            const response = await fetch('/api/getTags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    type: imageType,
                }),
            });
            setTagFetching(false)
            const data = await response.json();
            if (data && data.tags) {
                return data.tags;
            } else {
                console.error('Error fetching tags:', data.error);
                return [];
            }
        } catch (error) {
            setTagFetching(false)
            console.error('Failed to get tags:', error);
            return [];
        }
    };

    const triggerToTagsPage = async () => {
        const requests = [];

        for (let listing of listings) {
            if (listing.items.main && listing.items.main.image) {
                const mainImageBase64 = await convertBlobToBase64(listing.items.main.image);
                requests.push(getTagsFromGoogleVision(mainImageBase64, 'main'));
            }

            if (listing.items.brandTag && listing.items.brandTag.image) {
                const brandTagImageBase64 = await convertBlobToBase64(listing.items.brandTag.image);
                requests.push(getTagsFromGoogleVision(brandTagImageBase64, 'brandTag'));
            }
        }

        const responses = await axios.all(requests);

        setListings(prevListings => {
            let responseIndex = 0;
            const updatedListings = prevListings.map(listing => {
                // Merge tags from 'main' and 'brandTag' (if present).
                listing.tags = [...responses[responseIndex]];

                responseIndex++;

                if (listing.items.brandTag && listing.items.brandTag.image) {
                    listing.tags = [...listing.tags, ...responses[responseIndex]];

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

    const fileToBase64 = (file) => {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // split to get only Base64 value
            reader.onerror = error => reject(error);
        });
    }



    const handleEmployeeUploadAll = async () => {
        setUploading(true);

        const convertedListings = await Promise.all(listings.map(async listing => {
            const mainImageUrl = listing.items.main.url
            const brandImageUrl = listing.items.brandTag
                ? listing.items.brandTag.url
                : null;

            let JSON = {
                employeeName: employeeName,
                type: 'employee',
                listType: listType,
                mainImage: mainImageUrl,
                brandImage: brandImageUrl,
                tags: listing.items.tags,
            }


            return JSON;
        }));

        try {
            const requests = convertedListings.map(listing =>
                axios.post('/api/add-listing', { listing })
            );

            const responses = await axios.all(requests);
            const results = responses.map(response => response.data);



            NotificationManager.success('Listing added successfully!');
        } catch (error) {
            console.error(error);
        } finally {
            setEndTime(moment().format('HH:mm:ss'))
            setStep(3)

            onFecth();
            setUploading(false);
        }
    };

    const handleAdminUploadAll = async () => {
        setUploading(true);

        const convertedListings = await Promise.all(listings.map(async listing => {
            const mainImageUrl = listing.items.main.url
            const brandImageUrl = listing.items.brandTag
                ? listing.items.brandTag.url
                : null;

            let JSON = {
                type: 'admin',
                category: category,
                floorPrice: parseInt(floorPrice),
                maxPrice: parseInt(maxPrice),
                dataSource: dataSource,
                isAuctioned: isAuctioned,
                price: parseInt(price),
                listType: listType,
                isAuctioned: isAuctioned,
                auctionTime: auctionTime,
                auctionFloorPrice: parseInt(auctionFloorPrice),
                auctionMaxPrice: parseInt(auctionMaxPrice),
                delivery: delivery,
                mainImage: mainImageUrl,
                brandImage: brandImageUrl,
                tags: listing.items.tags,
            }


            return JSON;
        }));

        try {
            const requests = convertedListings.map(listing =>
                axios.post('/api/add-listing', { listing })
            );

            const responses = await axios.all(requests);
            const results = responses.map(response => response.data);



            NotificationManager.success('Listing added successfully!');
        } catch (error) {
            console.error(error);
        } finally {
            setEndTime(moment().format('HH:mm:ss'))
            setStep(3)

            onFecth();
            setUploading(false);
        }
    };

    const handleUploadAll = async () => {
        setUploading(true);

        const convertedListings = await Promise.all(listings.map(async listing => {
            const mainImageUrl = listing.items.main.url
            const brandImageUrl = listing.items.brandTag
                ? listing.items.brandTag.url
                : null;

            return {
                type: 'simple',
                mainImage: mainImageUrl,
                brandImage: brandImageUrl,
                category: category,
                subCategoryOne: subCategoryOne,
                subCategoryTwo: subCategoryTwo,
                tags: listing.tags,
            };
        }));

        try {
            const requests = convertedListings.map(listing =>
                axios.post('/api/add-listing', { listing })
            );

            const responses = await axios.all(requests);
            const results = responses.map(response => response.data);



            onFecth();
            NotificationManager.success('Listing added successfully!');
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
            onBack();
        }
    };



    const changeTags = (listingIndex, newTags) => {
        const newListing = [...listings];
        newListing[listingIndex].tags = newTags
        setListings(newListing);
    }
    const viewProduct = (link) => {
        window.open(link, "blank")
    }



    function onChangeTags(newTags, listingIndex) {
        // Since newTags is already the array of updated tags
        const updatedTags = newTags;

        // Create a copy of listings and update the specific listing's tags
        const updatedListings = [...listings];
        updatedListings[listingIndex].tags = updatedTags;

        // Update the listings state (assuming you have a setState method for listings)
        setListings(updatedListings);
    }







    return (
        <div className="max-w-7xl mx-auto px-5 pb-8 pt-6">
            <div className="flex items-center">
                <svg onClick={onBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <h3 className="ml-3 text-2xl">
                    Add listing
                </h3>
            </div>
            {tags}
            {showModal && (
                <ImageCropper
                    imageSrc={cropImage}
                    onClose={() => setShowModal(false)}
                    onCrop={handleCrop}
                />
            )}

            {!uploading ? (
                <>
                    {step === 0 ?
                        <div>
                            <div className="flex items-center justify-center mt-5">
                                <button onClick={() => setType('simple')} className={`${type === 'simple' ? 'bg-primary text-white' : 'bg-white'} duration-250 ease-in-out  rounded-l-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                    Simple
                                </button>
                                <button onClick={() => setType('employee')} className={`${type === 'employee' ? 'bg-primary text-white' : 'bg-white'} duration-250 ease-in-out  px-8 text-xl py-2.5 border border-gray-300`}>
                                    Employee
                                </button>
                                <button onClick={() => setType('admin')} className={`${type === 'admin' ? 'bg-primary text-white' : 'bg-white'} duration-250 ease-in-out  rounded-r-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                    Admin
                                </button>
                            </div>

                            <ButtonComponent full onClick={() => setStep(1)} className={`mt-16 mx-auto !w-64 rounded-lg !text-black`}>Next</ButtonComponent>
                        </div>


                        : ''}

                    {type === 'admin' ?
                        <div className="">
                            {step === 1 ?
                                <div className="w-96 mx-auto">
                                    <div className="w-96 mx-auto">
                                        <label>Category</label>
                                        <select value={category} className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600" onChange={(e) => setCategory(e.target.value)}>
                                            <option value="" disabled>Select type</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Footwear">Footwear</option>
                                            <option value="Hats">Hats</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-between w-96 mx-auto gap-2 mt-5">
                                        <div className="">
                                            <label>Floor price</label>
                                            <div className="relative flex items-center">
                                                <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                <input value={floorPrice} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setFloorPrice(e.target.value)} />
                                            </div>


                                        </div>
                                        <div className="">
                                            <label>Max price</label>
                                            <div className="relative flex items-center">
                                                <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                <input value={maxPrice} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setMaxPrice(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-96 mx-auto mt-5">
                                        <label>Data source</label>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => setDataSource('store_only')} className={`${dataSource === 'store_only' ? 'bg-primary text-white' : 'bg-white'} duration-250 ease-in-out  rounded-l-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                                Store only
                                            </button>
                                            <button onClick={() => setDataSource('network')} className={`${dataSource === 'network' ? 'bg-primary text-white' : 'bg-white'} duration-250 ease-in-out rounded-r-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                                Network
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <label className="relative mb-4 flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={isOptionToAuction}
                                                    onChange={() => setIsOptionToAuction(!isOptionToAuction)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Option to Auction
                                                </span>

                                            </label>
                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <label className="relative mb-4 flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={isViewSimilarListings}
                                                    onChange={() => setIsViewSimilarListings(!isViewSimilarListings)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    View Similar Listings
                                                </span>

                                            </label>
                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <label className="relative mb-4 flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={isOptionToEdit}
                                                    onChange={() => setIsOptionToEdit(!isOptionToEdit)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Option to Edit Tags
                                                </span>

                                            </label>
                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <label className="relative mb-4 flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={isGenerateSKULabels}
                                                    onChange={() => setIsGenerateSKULabels(!isGenerateSKULabels)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Generate SKU Labels
                                                </span>

                                            </label>
                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <label className="relative mb-4 flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value=""
                                                    className="sr-only peer"
                                                    checked={isIncludeRetailPrice}
                                                    onChange={() => setIsIncludeRetailPrice(!isIncludeRetailPrice)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f7895e] dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#FF9C75]"></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    Include Retail Price
                                                </span>

                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-semibold mt-8 mb-2">Start Listing!</h3>
                                        <div className="border border-gray-500 rounded-xl w-72 px-4 py-3">
                                            <h3 className="text-xl font-semibold">Instructions</h3>

                                            <ul className=" list-decimal ml-4 text-lg">

                                                <li>Photo of the front</li>
                                                <li>Photo of the item tag</li>
                                                <li>Add to the appropriate pile</li>
                                            </ul>
                                        </div>
                                        <div className="flex mt-8 rounded-2xl gap-2">
                                            {showCamera ?
                                                <Capture onCapture={capture} loading={imageUploading} text={currentPhotoType === 'main' ? 'Main Image' : 'BrandTag'} />
                                                :
                                                <div>
                                                    <div onClick={() => setShowCamera(true)} className="rounded-2xl px-2 w-full  cursor-pointer hover:opacity-70 flex items-center justify-center w-1/2 sm:w-72 border-2 shadow-md h-56">
                                                        <div>
                                                            <h1 className="text-xl text-center font-medium font-mono ">Take Photo</h1>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mt-4 mx-auto">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {listings.length !== 0 ?
                                                        <ButtonComponent loading={uploading} full onClick={() => handleAdminUploadAll()} className={`!mt-12 mx-auto !w-64 rounded-lg !text-black`}>Stop</ButtonComponent> : ''}
                                                </div>
                                            }
                                        </div>

                                    </div>

                                </div> : ''}

                            {step === 2 ?
                                <div className="px-5 mt-6 w-[480px] mx-auto">

                                    <div className="flex items-center justify-center mt-5">
                                        <button onClick={() => setListType('dispose')} className={`${listType === 'dispose' ? 'bg-red-500 text-white' : 'bg-white'} duration-250 min-w-[100px] ease-in-out  rounded-l-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Dispose
                                        </button>
                                        <button onClick={() => setListType('list')} className={`${listType === 'list' ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[100px] ease-in-out rounded-r-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            List
                                        </button>
                                    </div>

                                    <div className="mt-6 mb-4">
                                        <div className="flex gap-4 flex-wrap justify-center items-center ">
                                            {uploadedImages.main ?
                                                <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                    <div className="w-full flex items-center justify-center">
                                                        <img src={uploadedImages.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                    </div>
                                                </div>
                                                : ''}
                                            {isOptionToEdit ?
                                                <>
                                                    {!tagFetching ?
                                                        <>
                                                            <EditTagsModalOffline
                                                                open={tagEditModal}
                                                                onClose={() => setTagEditModal(false)}
                                                                setTags={(e) => changeTagsAdmin(e)}
                                                                data={uploadedImages?.tags}
                                                            />
                                                            <button onClick={() => onManageTags()} className="underline text-xl ml-3">Manage Tags</button>
                                                        </> : <LoadingComponent size='sm' />}
                                                </>
                                                : ''}
                                        </div>

                                        {isViewSimilarListings ? <div className="mt-6">
                                            <div className="flex items-center">
                                                <h3 className="text-lg">Similar Online Listings: </h3>
                                                {!fetchingSimilarProducts ?
                                                    <button onClick={() => fetchSimilarProducts()} className="underline text-xl ml-3">View</button> : ''}
                                            </div>

                                            {!fetchingSimilarProducts ?
                                                <div className="mt-3 flex overflow-x-auto">
                                                    {similarProducts.map((row, key) => (
                                                        <div key={key} className="mx-2 w-48 cursor-pointer" onClick={() => {
                                                            setActiveResultIndex(key)
                                                            setPrice(row.price ? row.price : 0)
                                                            setRetailPrice(row.price ? row.price : 0)
                                                        }} >
                                                            <div className={`${activeResultIndex === key ? 'border-[3px] border-green-600' : 'border-2 border-primary'} flex items-center justify-center rounded-2xl px-4 py-5 !w-48 !h-48 flex-shrink-0 my-1 relative`}>
                                                                <img src={row.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                            </div>
                                                            <div key={key} className="mt-2 mx-1 w-full">
                                                                <h3 className='text-xl text-center truncate'>{row.name}</h3>
                                                                <h3 className='text-xl text-center'>{row.price ? '$' + row.price : 'No price'}</h3>
                                                                <div className="flex justify-center">
                                                                    <button onClick={() => viewProduct(row.link)} className="underline text-xl">View</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div> : <LoadingComponent size='sm' />}
                                        </div> : ''}
                                    </div>

                                    <div className="flex mx-1 justify-between">
                                        <div>

                                            {isIncludeRetailPrice ?
                                                <div className="mt-3">
                                                    <label className="block text-lg">Retail Compare</label>
                                                    <div className="relative flex items-center">
                                                        <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                        <input value={retailPrice} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setRetailPrice(e.target.value)} />
                                                    </div>
                                                </div> : ''}
                                            <div className="mt-3">
                                                <label className="block text-lg">Your Price</label>
                                                <div className="relative flex items-center">
                                                    <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                    <input value={price} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setPrice(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 justify-center">
                                            <button onClick={() => setPrice(Number(Number(price) + 1))} className="border-2 p-1 border-gray-500 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-green-500">
                                                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                            <button onClick={() => setPrice(Number(Number(price) - 1))} className="border-2 p-1 border-gray-500 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-red-500">
                                                    <path fill-rule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>


                                    </div>

                                    {isOptionToAuction ? <div className="flex justify-center mt-3">
                                        <button onClick={() => setIsAuctioned(true)} className={`${isAuctioned ? 'border border-gray-300 text-white bg-green-500' : 'border-2 border-green-400 text-green-400'}  duration-300 min-w-[100px] ease-in-out rounded-xl px-8 text-xl py-2.5`}>
                                            Auction
                                        </button>
                                    </div> : ''}

                                    {isAuctioned ?
                                        <div>
                                            <div className="flex items-center justify-center mt-5">
                                                <button onClick={() => setAuctionTime(12)} className={`${auctionTime === 12 ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[30px] ease-in-out  rounded-l-xl px-6 text-base py-2 border border-gray-300`}>
                                                    12hrs
                                                </button>
                                                <button onClick={() => setAuctionTime(24)} className={`${auctionTime === 24 ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[30px] ease-in-out px-6 text-base py-2 border border-gray-300`}>
                                                    24hrs
                                                </button>
                                                <button onClick={() => setAuctionTime(48)} className={`${auctionTime === 48 ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[30px] ease-in-out rounded-r-xl px-6 text-base py-2 border border-gray-300`}>
                                                    48hrs
                                                </button>
                                            </div>

                                            <div className="flex items-center w-96 justify-between mx-auto gap-2 mt-5">

                                                <div>
                                                    <label className="block text-sm">Floor price</label>
                                                    <div className="relative flex items-center">
                                                        <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                        <input value={auctionFloorPrice} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setAuctionFloorPrice(e.target.value)} />
                                                    </div>
                                                </div>


                                                <h3 className="mx-3 text-xl">to</h3>
                                                <div>
                                                    <label className="block text-sm">Max price</label>
                                                    <div className="relative flex items-center">
                                                        <h3 className="absolute text-base left-3 mt-1">$</h3>
                                                        <input value={auctionMaxPrice} type="number" className="w-24 mt-1 rounded-xl pl-6 pr-2  py-2 border border-gray-600" onChange={(e) => setAuctionMaxPrice(e.target.value)} />
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="w-96 mx-auto mt-4">
                                                <label>Delivery</label>
                                                <select value={delivery} className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600" onChange={(e) => setDelivery(e.target.value)}>
                                                    <option value="" disabled>Select delivery</option>
                                                    <option value="Clothing">1</option>
                                                    <option value="Footwear">2</option>
                                                    <option value="Hats">3</option>
                                                </select>
                                            </div>
                                        </div> : ''
                                    }

                                    <div className="flex items-center justify-center gap-3 mt-8">
                                        <button onClick={() => handleAdminListMore()} className={` hover:bg-red-500 hover:text-white duration-300 min-w-[100px] ease-in-out  rounded-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Dispose
                                        </button>
                                        <button onClick={() => handleAdminListMore()} className={` hover:bg-green-500 hover:text-white duration-300 min-w-[100px] ease-in-out rounded-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            {isGenerateSKULabels ? 'Print SKU' : 'List'}
                                        </button>
                                    </div>
                                </div>
                                : ''}

                            {
                                step === 3 ?
                                    <>
                                        <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">

                                            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table class="w-full text-sm text-left text-gray-500">
                                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" class="px-6 py-3">
                                                                Disposed
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                Listed
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                Start time
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                End time
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="bg-white dark:bg-gray-800">
                                                            <td class="px-6 py-4">
                                                                {listings.filter(x => x.list_type === 'dispose').length}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {listings.filter(x => x.list_type === 'list').length}
                                                            </td>

                                                            <td class="px-6 py-4">
                                                                {startTime}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {endTime}
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>


                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <ButtonComponent rounded className="!w-48 mt-6" onClick={() => onBack()} >Home page</ButtonComponent>
                                        </div>
                                    </> : ''
                            }
                        </div>
                        : ''}

                    {type === 'employee' ?

                        <div className="">

                            {step === 1 ?
                                <div>
                                    <div className="flex justify-center mt-12">
                                        <div>
                                            <label className="text-lg mb-1 block text-gray-700 font-medium">Employee name:</label>
                                            <input type="text" className="bg-white w-72 mx-auto form-input  focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500  rounded-lg  px-4 py-2.5" onChange={(e) => setEmployeeName(e.target.value)} />
                                        </div>

                                    </div>
                                    <div className="border border-gray-500 mx-auto mt-8 min-w-[288px] rounded-xl max-w-fit px-4 py-3">
                                        <h3 className="text-xl font-semibold">Instructions</h3>

                                        <ul className=" list-decimal ml-4 text-lg">

                                            <li>Photo of the front</li>
                                            <li>Photo of the item tag</li>
                                            <li>Add to the appropriate pile</li>
                                        </ul>
                                    </div>
                                    <div className="flex justify-center mt-8 rounded-2xl mx-auto gap-2">
                                        {showCamera ?
                                            <Capture onCapture={capture} loading={imageUploading} text={currentPhotoType === 'main' ? 'Main Image' : 'BrandTag'} /> :
                                            <div>
                                                <div onClick={() => setShowCamera(true)} className="rounded-2xl px-2 w-full  cursor-pointer hover:opacity-70 flex items-center justify-center w-1/2 sm:w-72 border-2 shadow-md h-56">
                                                    <div>


                                                        <h1 className="text-xl text-center font-medium font-mono ">Take Photo</h1>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mt-4 mx-auto">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {listings.length !== 0 ?
                                                    <ButtonComponent loading={uploading} full onClick={() => handleEmployeeUploadAll()} className={`!mt-12 mx-auto !w-64 rounded-lg !text-black`}>Stop</ButtonComponent> : ''}
                                            </div>}
                                    </div>

                                </div> : ''
                            }



                            {step === 2 ?
                                <div className="px-5 mt-6 w-full">

                                    <div className="flex items-center justify-center mt-5">
                                        <button onClick={() => setListType('dispose')} className={`${listType === 'dispose' ? 'bg-red-500 text-white' : 'bg-white'} duration-250 min-w-[100px] ease-in-out  rounded-l-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Dispose
                                        </button>
                                        <button onClick={() => setListType('list')} className={`${listType === 'list' ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[100px] ease-in-out  px-8 text-xl py-2.5 border border-gray-300`}>
                                            List
                                        </button>
                                        <button onClick={() => setListType('auction')} className={`${listType === 'auction' ? 'bg-green-500 text-white' : 'bg-white'} duration-250 min-w-[100px] ease-in-out  rounded-r-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Auction
                                        </button>
                                    </div>


                                    <div className="flex gap-4 flex-wrap justify-center  mb-4 mt-6">
                                        {uploadedImages.main ?
                                            <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={uploadedImages.main.image} alt={'Main Photo'} className="rounded max-w-full max-h-full" />
                                                </div>

                                            </div> : ''}
                                        {uploadedImages.brandTag ?
                                            <div className=" border-2 border-primary rounded-2xl px-4 py-5 w-64 my-1 relative">
                                                <div className="w-full flex items-center justify-center">
                                                    <img src={uploadedImages.brandTag.image} alt={'Brand Tag Photo'} className="rounded max-w-full max-h-full" />
                                                </div>



                                            </div> : ''}

                                    </div>

                                    <div className="flex items-center justify-center mt-5">
                                        <button onClick={() => handleEmployeeListMore()} className={` hover:bg-red-400 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-l-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Dispose
                                        </button>
                                        <button onClick={() => handleEmployeeListMore()} className={` hover-bg-primary hover:text-white duration-250 min-w-[100px] ease-in-out rounded-r-xl px-8 text-xl py-2.5 border border-gray-300`}>
                                            Keep
                                        </button>
                                    </div>


                                </div>
                                : ''}

                            {
                                step === 3 ?
                                    <>
                                        <div className="sm:flex flex-wrap justify-center sm:justify-start mt-4 items-center">

                                            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table class="w-full text-sm text-left text-gray-500">
                                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" class="px-6 py-3">
                                                                Disposed
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                Listed
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                Auctioned
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                Start time
                                                            </th>
                                                            <th scope="col" class="px-6 py-3">
                                                                End time
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="bg-white dark:bg-gray-800">
                                                            <td class="px-6 py-4">
                                                                {listings.filter(x => x.list_type === 'dispose').length}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {listings.filter(x => x.list_type === 'list').length}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {listings.filter(x => x.list_type === 'auction').length}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {startTime}
                                                            </td>
                                                            <td class="px-6 py-4">
                                                                {endTime}
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>


                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <ButtonComponent rounded className="!w-48 mt-6" onClick={() => onBack()} >Home page</ButtonComponent>
                                        </div>
                                    </> : ''
                            }


                        </div> : ''}

                    {type === 'simple' ?
                        <div className="">


                            {[1, 2, 3, 4].includes(step) ?
                                <div className=" mx-auto">
                                    {!image.url && [1, 2, 3].includes(step) ? (
                                        <div className="flex justify-center mt-8 rounded-2xl mx-auto gap-2">

                                            <label className="rounded-2xl px-2   cursor-pointer hover:opacity-70 flex items-center justify-center w-1/2 sm:w-56 border-2 shadow-md h-56">
                                                <div>
                                                    <input type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => handleImageChange(e)} />
                                                    <h1 className="text-xl text-center font-medium font-mono ">Take Photo</h1>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mt-4 mx-auto">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                    </svg>
                                                </div>
                                            </label>
                                        </div>
                                    ) : ''}
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

                                            <div className="w-64 mx-auto">
                                                <label>Category</label>
                                                <select value={category} className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600" onChange={(e) => setCategory(e.target.value)}>
                                                    <option value="" disabled>Select type</option>
                                                    <option value="Clothing">Clothing</option>
                                                    <option value="Footwear">Footwear</option>
                                                    <option value="Hats">Hats</option>
                                                </select>
                                            </div>
                                            {/* Sub-category 01 */}
                                            <div className="w-64 mx-auto mt-4">
                                                <label>Sub-category 01</label>
                                                <select value={subCategoryOne} className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600" onChange={(e) => setSubCategoryOne(e.target.value)}>
                                                    <option value="" disabled>Select sub-category 01</option>
                                                    {computedCategoryOne().map(option => (
                                                        <option key={option.value} value={option.value}>{option.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Sub-category 02 */}
                                            <div className="w-64 !mb-6 mx-auto mt-4">
                                                <label>Sub-category 02</label>
                                                <select value={subCategoryTwo} className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600" onChange={(e) => setSubCategoryTwo(e.target.value)}>
                                                    <option value="" disabled>Select sub-category 02</option>
                                                    {computedCategoryTwo().map(option => (
                                                        <option key={option.value} value={option.value}>{option.name}</option>
                                                    ))}
                                                </select>
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


                                    {listings.length > 0 ? (

                                        <div className="mt-10 ml-3">

                                            <div className="flex justify-center sm:justify-start mt-1">
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
                                            <div className="flex justify-center sm:justify-start mt-1">
                                                <ButtonComponent rounded className="!w-48" onClick={() => triggerToTagsPage()} >Generate Tags</ButtonComponent>
                                            </div>

                                        </div>
                                    ) : ""
                                        // <div className="flex justify-center sm:justify-start mt-10 ml-3">
                                        //     <ButtonComponent rounded className="!w-48" onClick={() => setStep(7)} >Review All</ButtonComponent>
                                        // </div>
                                    }
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




                                            <div className="mt-6 mb-5">
                                                <TagsInput value={row.tags} onChange={(e) => onChangeTags(e, index)} />
                                            </div>




                                        </div>
                                    ))}
                                    <div className="flex justify-center sm:justify-start mt-1">
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
                                                    <ListingItem key={key} mainPhoto={row.items?.main?.image} brandPhoto={row.items?.brandTag?.image} tags={row.tags}>
                                                        <button onClick={() => triggerEditTagsModalOffline(key)} className=" bg-lightprimary px-3 py-1 text-xs mt-1 rounded">
                                                            Edit Tags
                                                        </button>
                                                    </ListingItem>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-center sm:justify-start mt-1">
                                            <ButtonComponent rounded className="!w-48 mt-6" onClick={handleUploadAll} >Upload All</ButtonComponent>
                                        </div>
                                    </> : ''
                            }
                            <EditTagsModalOffline
                                open={tagEditModal}
                                onClose={() => setTagEditModal(false)}
                                setTags={(e) => changeTags(activeTagIndex, e)}
                                data={listings[activeTagIndex] && listings[activeTagIndex].tags}
                            />

                        </div > : ''}
                </>
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
