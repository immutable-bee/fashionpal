import { useState, useEffect } from "react";
import Image from "next/image";
import cloneDeep from "lodash.clonedeep";
import ModalComponent from "@/components/utility/Modal";
const Alerts = ({ props, fetchUserData }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newZip, setNewZip] = useState("");

  const [titles, setTitles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);

  const initialInputValues = {
    brand: "",
    type: "",
    size: "",
    length: "",
    color: "",
  };

  const [inputValues, setInputValues] = useState(initialInputValues);
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const createAlert = () => {
    setAlerts((prevAlerts) => [...prevAlerts, { ...inputValues }]);

    // Clear the inputs
    setInputValues(initialInputValues);
  };

  const handleDeleteAlert = (index) => {
    const newAlerts = cloneDeep(alerts);
    newAlerts.splice(index, 1);
    if (newAlerts.length === 0) {
      setIsModalOpen(false);
    }
    setAlerts(newAlerts);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (props) {
      setTitles(props.titles);
      setAuthors(props.authors);
      setZipCodes(props.zipCodes);
    }
  }, [props]);

  const handleTitleSubmit = async (e) => {
    e.preventDefault();
    if (newTitle !== "") {
      const res = await fetch("/api/consumer/update/titleAlerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          title: newTitle,
          type: "add",
        }),
      });
      if (!res.ok) {
        return;
      }

      fetchUserData();
      setNewTitle("");
    }
  };

  const handleAuthorSubmit = async (e) => {
    e.preventDefault();
    if (newAuthor !== "") {
      const res = await fetch("/api/consumer/update/authorAlerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          author: newAuthor,
          type: "add",
        }),
      });
      if (!res.ok) {
        return;
      }

      fetchUserData();
      setNewAuthor("");
    }
  };

  const handleZipSubmit = async (e) => {
    e.preventDefault();
    if (newZip !== "") {
      const res = await fetch("/api/consumer/update/zipCodeAlerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: props.email, zip: newZip, type: "add" }),
      });
      if (!res.ok) {
        return;
      }

      fetchUserData();
      setNewZip("");
    }
  };

  const deleteTitle = async (index) => {
    const res = await fetch("/api/consumer/update/titleAlerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        title: titles[index],
        type: "delete",
      }),
    });
    fetchUserData();
  };

  const deleteAuthor = async (index) => {
    const res = await fetch("/api/consumer/update/authorAlerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        author: authors[index],
        type: "delete",
      }),
    });
    fetchUserData();
  };

  const deleteZipCode = async (index) => {
    const res = await fetch("/api/consumer/update/zipCodeAlerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        zip: zipCodes[index],
        type: "delete",
      }),
    });
    fetchUserData();
  };

  return (
    <>
      <ModalComponent
        open={isModalOpen}
        title="All Alerts"
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="flex justify-end w-full">
            <button
              className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        }
      >
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-white relative rounded-lg w-full shadow px-4 py-3"
          >
            <div>Brand: {alert.brand}</div>
            <div>Type: {alert.type}</div>
            <div>Size: {alert.size}</div>
            <div>Length: {alert.length}</div>
            <div>Color: {alert.color}</div>
            <button
              onClick={() => handleDeleteAlert(index)}
              className="bg-red-600 absolute top-2 right-2 hover:bg-opacity-90 text-white font-bold py-1 px-1 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        ))}
      </ModalComponent>

      <div>
        <div className="py-2">
          <label className="text-sm text-black font-medium">Brand:</label>
          <input
            type="text"
            className="bg-white  form-input mt-1 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
            name="brand"
            value={inputValues.brand}
            onChange={handleChange}
          />
        </div>
        <div className="py-2">
          <label className="text-sm text-black font-medium">Type:</label>
          <input
            type="text"
            className="bg-white  form-input mt-1 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
            name="type"
            value={inputValues.type}
            onChange={handleChange}
          />
        </div>
        <div className="py-2">
          <label className="text-sm text-black font-medium">Size:</label>
          <input
            type="text"
            className="bg-white  form-input mt-1 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
            name="size"
            value={inputValues.size}
            onChange={handleChange}
          />
        </div>
        <div className="py-2">
          <label className="text-sm text-black font-medium">Length:</label>
          <input
            type="text"
            className="bg-white  form-input mt-1 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
            name="length"
            value={inputValues.length}
            onChange={handleChange}
          />
        </div>
        <div className="py-2">
          <label className="text-sm text-black font-medium">Color:</label>
          <input
            type="text"
            className="bg-white  form-input mt-1 focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
            name="color"
            value={inputValues.color}
            onChange={handleChange}
          />
        </div>

        <button
          className="bg-secondary text-white px-4 mt-2 py-1.5 flex items-center  rounded-md  text-decoration-none"
          onClick={createAlert}
        >
          Create Alert
        </button>
        {alerts.length !== 0 ? (
          <button
            className="bg-primary text-white px-4 mt-2 py-1.5 flex items-center  rounded-md  text-decoration-none"
            onClick={toggleModal}
          >
            View All Alerts
          </button>
        ) : (
          ""
        )}
      </div>

      <div>
        <div>
          <h3 className="text-xl mt-5 sm:mt-16 font-medium">
            Book alert zip codes
          </h3>
        </div>
        <div className="mt-4">
          <label className="text-sm text-black font-medium">Zip Code</label>
          <div>
            <form
              className="flex my-1"
              onSubmit={handleZipSubmit}
            >
              <input
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                className="bg-white  form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
                type="text"
                placeholder="1593300"
              />
              <button
                type="submit"
                className="bg-primary px-3 flex items-center  rounded-lg  text-decoration-none ms-2"
              >
                <Image
                  src={"/images/copy.svg"}
                  width={20}
                  height={20}
                  alt="profile-icon"
                  className="img-fluid"
                />
              </button>
            </form>
          </div>
          <div className="flex items-center mt-3">
            {zipCodes?.map((row, index) => (
              <div
                key={index}
                className="flex mx-1"
              >
                <p className="rounded-full flex items-center border text-sm font-medium border-primary px-2 py-1">
                  {row}
                  <span
                    className="ms-2 cursor-pointer"
                    onClick={() => deleteZipCode(index)}
                  >
                    <Image
                      src={"/images/close-circle.svg"}
                      alt=""
                      className="w-4"
                      width={4}
                      height={4}
                    />
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Alerts;
