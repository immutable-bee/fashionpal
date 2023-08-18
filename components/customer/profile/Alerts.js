import { useState, useEffect } from "react";
import Image from "next/image";

const Alerts = ({ props, fetchUserData }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newZip, setNewZip] = useState("");

  const [titles, setTitles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);

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
      <div className="mt-1 sm:mt-4">
        <label className="text-sm text-black font-medium">Titles</label>
        <div>
          <form className="flex my-1" onSubmit={handleTitleSubmit}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white  form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
              type="text"
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
          {titles?.map((title, index) => (
            <div key={index} className="flex mx-1">
              <p className="rounded-full flex items-center border text-xs sm:text-sm font-medium border-primary px-2 py-1">
                {title}
                <span
                  className="ms-2 cursor-pointer"
                  onClick={() => deleteTitle(index)}
                >
                  <Image
                    src={"/images/close-circle.svg"}
                    alt=""
                    className="w-3 sm:w-4"
                    width={4}
                    height={4}
                  />
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm text-black font-medium">Authors</label>
        <div>
          <form className="flex my-1" onSubmit={handleAuthorSubmit}>
            <input
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="bg-white  form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 py-2.5"
              type="text"
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
          {authors?.map((author, index) => (
            <div key={index} className="flex mx-1">
              <p className="rounded-full flex items-center border text-sm font-medium border-primary px-2 py-1">
                {author}
                <span
                  className="ms-2 cursor-pointer"
                  onClick={() => deleteAuthor(index)}
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

      <div>
        <div>
          <h3 className="text-xl mt-5 sm:mt-16 font-medium">
            Book alert zip codes
          </h3>
        </div>
        <div className="mt-4">
          <label className="text-sm text-black font-medium">Zip Code</label>
          <div>
            <form className="flex my-1" onSubmit={handleZipSubmit}>
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
              <div key={index} className="flex mx-1">
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
