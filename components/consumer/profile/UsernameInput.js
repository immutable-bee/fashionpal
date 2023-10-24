import { Loading } from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect } from "react";

const UsernameInput = ({ props, onUsernameUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState(props.username);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/consumer/update/username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: props.email, username: username }),
    });
    if (!res.ok) {
      setLoading(false);
    }
    setLoading(false);
    setUsername("");
    onUsernameUpdate(username);
  };

  const handleChange = (e) => {
    setIsTyping(e.target.value !== "");
    const value = e.target.value;
    setUsername(value);
  };

  return (
    <div className="py-2 mt-0 sm:mt-6">
      <label className="text-sm text-black font-medium">Username</label>
      <div className="flex items-center">
        <input
          className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
          type="text"
          placeholder={props.username}
          onChange={handleChange}
          value={username}
        />
        {isTyping && !loading ? (
          <button
            onClick={handleSubmit}
            className="bg-blbBlue flex items-center py-3 rounded-lg px-3 ms-2"
          >
            <Image
              src="/images/icons/icon-upload.svg"
              width={20}
              height={20}
              alt="update username icon"
              className="img-fluid"
            />
          </button>
        ) : loading ? (
          <Loading />
        ) : null}
      </div>
    </div>
  );
};

export default UsernameInput;
