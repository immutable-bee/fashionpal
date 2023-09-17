import { useState, useEffect } from "react";
import Image from 'next/image';
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from 'react-notifications';
import ButtonComponent from "@/components/utility/Button";
function ProductDetails({ open, onClose, tags, listingId, onFecth }) {
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);
    const [modalType, setModalType] = useState('creating')
    const [activeIndex, setActiveIndex] = useState(null)
    const [data, setData] = useState({
        name: '',
        value: ''
    })

    const onNameChange = (e) => {
        setData(prevState => ({ ...prevState, name: e.target.value }));
    }

    const triggerDeleteModal = (index) => {
        setActiveDeleteIndex(index)
        setDeleteModal(true)
    };

    const onValueChange = (e) => {
        setData(prevState => ({ ...prevState, value: e.target.value }));
    }

    const triggerAddModal = (index) => {
        setModalType('creating')
        setData({
            name: '',
            value: ''
        })
        setActiveIndex(null)
        setOpenModal(true)
    }
    const triggerEditModal = (index) => {
        setModalType('editing')
        setData(tags[index])
        setActiveIndex(index)
        setOpenModal(true)
    }

    const handleDeleteTag = async (tag) => {
        const id = tags[activeDeleteIndex].id
        setDeleteLoading(true)
        try {
            const res = await fetch(`/api/delete-tag/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const errorData = await res.json();
            setDeleteLoading(false)
            if (res.status === 200) {
                setDeleteModal(false)
                onFecth()

                NotificationManager.success(errorData.message)
            } else {
                // Handle error
                const errorData = await res.json();
                NotificationManager.error(errorData);
            }
        } catch (error) {
            console.error("An error occurred while deleting the listing", error);
        }
    }

    const onAction = async () => {
        setLoading(true);
        if (modalType === 'creating') {
            console.log('create', data)
            try {

                const response = await fetch(
                    `api/add-tag`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            listingId: listingId,
                            name: data.name,
                            value: data.value,
                        }),
                    }
                );

                const errorData = await response.json();
                setLoading(false)
                if (response.status === 200) {
                    setOpenModal(false)
                    onFecth()
                    NotificationManager.success(errorData.message)
                } else {
                    // Handle error
                    const errorData = await res.json();
                    NotificationManager.error(errorData);
                }

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        } else if (modalType === 'editing') {
            console.log('update', data, activeIndex)
            try {

                const response = await fetch(
                    `api/edit-tag`,
                    {
                        method: "PUT",
                        body: JSON.stringify({
                            id: data.id,
                            name: data.name,
                            value: data.value,
                        }),
                    }
                );

                console.log(response)

                const res = await response.json();
                console.log(res);
                if (!response.ok) {
                    throw new Error('Failed to upload.');
                }

                onFecth()

                NotificationManager.success('uploaded');
                setLoading(false);
                setOpenModal(false)


            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    }

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
                        {tags.map((tag, tagIndex) => (
                            <div key={tagIndex} style={{ boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }} className="  px-3 py-2 rounded-lg w-full items-center justify-between flex !my-2">

                                <div>
                                    <span>{tag.name}</span> &nbsp;&nbsp;&nbsp;
                                    <span>{tag.value}</span>
                                </div>
                                <div className="flex">
                                    <button onClick={() => triggerEditModal(tagIndex)} className="mx-1 bg-gray-400 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                        </svg>


                                    </button>
                                    <button onClick={() => triggerDeleteModal(tagIndex)} className="mx-1 bg-red-600 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded">

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>


                                    </button>
                                </div>
                            </div>
                        ))}
                        <button className=" bg-[#FF9C75] px-4 py-1.5 !mt-2 rounded-lg text-white" onClick={() => triggerAddModal()}>Add Tag</button>

                        <ModalComponent
                            open={openModal}
                            title={modalType === 'creating' ? 'Add Tags' : 'Edit Tags'}
                            onClose={() => setOpenModal(false)}
                            footer={
                                <div className="flex justify-end w-full">

                                    <ButtonComponent rounded loading={loading} onClick={() => onAction()}>{modalType === 'creating' ? 'Add' : 'Edit'}</ButtonComponent>
                                </div>
                            }
                        >
                            <div className="mx-1">
                                <labe class="text-sm text-gray-700">Value</labe>
                                <input className="w-full  rounded-lg px-3 py-1.5 !mt-2 border border-gray-600" type="text" value={data.value} onInput={(e) => onValueChange(e)} />
                            </div>
                            <div className="mx-1 !mt-3"> <labe class="text-sm text-gray-700">Name</labe>
                                <input className="w-full  rounded-lg px-3 py-1.5 !mt-2 border border-gray-600" type="text" value={data.name} onInput={(e) => onNameChange(e)} />
                            </div>

                        </ModalComponent>

                        <ModalComponent open={deleteModal}
                            onClose={() => setDeleteModal(false)} title="Confirm delete tag"
                            footer={
                                <div className="flex justify-end w-full">
                                    <ButtonComponent
                                        rounded
                                        id="close-unsubscribe-modal-btn" className="!mx-1 !px-5" loading={deleteLoading}
                                        onClick={() => handleDeleteTag()}
                                    >
                                        Delete
                                    </ButtonComponent>
                                </div>
                            }
                        >
                            <>
                                <h4 className="text-base">Are you sure you want to delete tag?</h4>
                            </>
                        </ModalComponent>

                    </ModalComponent> : ""
            }
        </div>
    );
}

export default ProductDetails;