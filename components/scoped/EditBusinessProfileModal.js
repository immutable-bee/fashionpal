import React, { useState } from "react";
import ModalComponent from "@/components/utility/Modal";

const EditBusinessProfileModal = ({ onClose, onDone }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [clothingValues, setClothingValues] = useState({});

  const addCategory = () => {
    if (category && !categories.includes(category)) {
      const newCategory = generateUniqueCategoryName(category);
      setCategories([...categories, newCategory]);
      setClothingValues({
        ...clothingValues,
        [newCategory]: "",
      });
      setCategory("");
    }
  };

  const generateUniqueCategoryName = (baseName) => {
    let counter = 1;
    let newCategory = `${baseName} #${counter}`;
    while (categories.includes(newCategory)) {
      counter++;
      newCategory = `${baseName} #${counter}`;
    }
    return newCategory;
  };

  const deleteCategory = (category) => {
    const updatedCategories = categories.filter((c) => c !== category);
    const { [category]: _, ...updatedClothingValues } = clothingValues;
    setCategories(updatedCategories);
    setClothingValues(updatedClothingValues);
  };

  const onSave = () => {
    const JSON = {
      name,
      email,
      data: clothingValues,
    };

    console.log(JSON);
    onDone();
  };

  return (
    <ModalComponent
      open={true}
      width="500px"
      title="Edit"
      onClose={() => onClose()}
      footer={
        <div className="flex justify-end w-full">
          <button
            className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
            onClick={() => onSave()}
          >
            Save
          </button>
        </div>
      }
    >
      <div>
        <div>
          <h1 className="text-md text-gray-700">Store Name</h1>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
          />
        </div>
        <div className="mt-3">
          <h1 className="text-md text-gray-700">Email</h1>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
          />
        </div>
        <div className=" rounded-2xl mt-4 py-3 px-3 border shadow-sm">
          <h1 className="text-xl text-black text-center">
            Liquidation Thresholds
          </h1>
          <div className="mt-4 flex justify-center items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-input border border-gray-500 max-w-[16rem] rounded-lg px-4 my-1 py-2"
            >
              <option value="">Add Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Hats">Hats</option>
            </select>
            <button
              onClick={addCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Category
            </button>
          </div>
          {categories && categories.length !== 0 ? (
            <div>
              <div className="flex items-center justify-end  mt-3">
                <h1 className="pr-[36px] font-medium">Days</h1>
              </div>
              {/* map */}
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between mt-2"
                >
                  <div className="flex items-center">
                    <svg
                      onClick={() => deleteCategory(category)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4 cursor-pointer hover:opacity-70 text-orange-500 mr-[10px]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>

                    <h1 className="pr-2 font-medium">{category}</h1>
                  </div>
                  <input
                    value={clothingValues[category]}
                    onChange={(e) =>
                      setClothingValues({
                        ...clothingValues,
                        [category]: e.target.value,
                      })
                    }
                    className="font-medium px-2 py-1 border focus:ring-1 focus:ring-[#ffc71f] border-green-500 focus:outline-none text-black rounded-xl w-28 h-10"
                  />
                </div>
              ))}
            </div>
          ) : (
            <h3 className="text-center mt-4 text-xl">No categories added</h3>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditBusinessProfileModal;
