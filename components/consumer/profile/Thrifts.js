import { useState, useEffect } from "react";
import ButtonComponent from "@/components/utility/Button";
import ModalComponent from "@/components/utility/Modal";

import { NotificationManager } from "react-notifications";
import debounce from "lodash.debounce";

const ThriftList = ({ toggleThrift, consumerData, setConsumerData }) => {
  const [dataList, setDataList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeDeleteId, setActiveDeleteId] = useState(null);
  const [newThrift, setNewThrift] = useState("");

  useEffect(() => {
    setDataList(consumerData.ThriftList);
  }, [consumerData]);
  const onConfirmDeleteListing = async () => {
    setDeleteLoading(true);
    const id = activeDeleteId;
    try {
      const res = await fetch(`/api/consumer/profile/thriftList/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
        }),
      });
      const errorData = await res.json();
      setDeleteLoading(false);
      if (res.ok) {
        const filterList = consumerData.ThriftList.filter(
          (elem) => elem.id !== id
        );
        1;
        setConsumerData({ ...consumerData, ThriftList: filterList });
        setDeleteModal(false);
        // fetchListings();
        setActiveDeleteId(null);
        NotificationManager.success(errorData.message);
      } else {
        // Handle error
        const errorData = await res.json();
        NotificationManager.error(errorData);
      }
    } catch (error) {
      console.error("An error occurred while deleting the listing", error);
    }
  };
  const triggerDeleteModal = (index) => {
    setActiveDeleteId(index);
    setDeleteModal(true);
  };
  const updateThriftListItem = async (fieldValue, id) => {
    try {
      const response = await fetch("/api/consumer/profile/thriftList/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isChecked: fieldValue,
          id: id,
        }),
      });

      if (response.ok) {
        const resp = await response.json();
        const index = consumerData.ThriftList.findIndex(
          (elem) => elem.id === id
        );
        if (index > -1) {
          let updatedConsumerData = consumerData;
          updatedConsumerData.ThriftList[index] = resp.updatedList;
          setConsumerData({ ...updatedConsumerData });
        }
      } else {
        console.error(`Error updating ${fieldName}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const debouncedSendFieldUpdate = debounce(updateThriftListItem, 500);

  const handleUpdate = (e, id) => {
    let { checked } = e.target;
    debouncedSendFieldUpdate(checked, id);
  };
  const handleInputChange = (e) => {
    setNewThrift(e.target.value);
  };
  const addNewThrift = async () => {
    try {
      if (newThrift) {
        const res = await fetch(`/api/consumer/profile/thriftList/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            detail: newThrift,
            customerId: consumerData.id,
          }),
        });
        const response = await res.json();
        setDeleteLoading(false);
        if (res.ok) {
          setNewThrift("");
          setConsumerData({
            ...consumerData,
            ThriftList: [...consumerData.ThriftList, response],
          });

          NotificationManager.success("thrift item added successfully");
        } else {
          // Handle error
          const errorData = await res.json();
          NotificationManager.error(errorData);
        }
      } else {
        NotificationManager.error("input field is required");
      }
    } catch (error) {
      console.error("An error occurred while deleting the listing", error);
    }
  };
  return (

  <div className='w-full xl:w-3/4 lg:w-3/4 md:w-full sm:w-full xs:w-full bg-white '>
      <div className=' flex items-center justify-center'>
        <div className='bg-white rounded shadow  p-6 m-4 w-full lg:max-xl '>
          <div class=' p-4 flex items-center'>
            <button onClick={toggleThrift} class=' text-lg font-semibold mr-2'>

              &#8592;
            </button>
            <h1 className="text-2xl text-center font-bold">Thrift List</h1>
          </div>
          <div className="flex mt-4 mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              placeholder="Add Thrift Item"
              value={newThrift}
              onChange={handleInputChange}
            />
            <button
              onClick={addNewThrift}
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal  hover:border-light"
            >
              Add
            </button>
          </div>
          <div>
            {dataList.length > 0 ? (
              dataList.map((listItem) => (
                <div
                  key={listItem.id}
                  className="flex mb-4 items-center"
                >
                  <input
                    id="checkbox"
                    aria-describedby="checkbox-description"
                    name="checkbox"
                    type="checkbox"
                    checked={listItem.isChecked}
                    onChange={(e) => handleUpdate(e, listItem.id)}
                    className="h-6 w-6 mr-2 rounded accent-white border-solid border-2 border-black"
                  />
                  <p
                    className={`w-full text-grey-darkest ${
                      listItem.isChecked ? "line-through" : ""
                    }`}
                  >
                    {listItem.description}
                  </p>

                  <button
                    onClick={() => triggerDeleteModal(listItem.id)}
                    className="flex-no-shrink p-2 ml-4 mr-2 text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <h5>No Record Found</h5>
            )}
          </div>
        </div>
      </div>
      <ModalComponent
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Confirm delete Thrift Item"
        footer={
          <div className="flex justify-end w-full">
            <ButtonComponent
              rounded
              id="close-unsubscribe-modal-btn"
              className="!mx-1 !px-5"
              loading={deleteLoading}
              onClick={() => onConfirmDeleteListing()}
            >
              Delete
            </ButtonComponent>
          </div>
        }
      >
        <>
          <h4 className="text-base">
            Are you sure you want to delete Thrift Item?
          </h4>
        </>
      </ModalComponent>
    </div>
  );
};

export default ThriftList;
