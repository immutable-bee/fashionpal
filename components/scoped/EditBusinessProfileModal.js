import React, { useEffect, useState } from "react";
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from "react-notifications";
import SelectCategory from "../business/SelectCategory";

const EditBusinessProfileModal = ({ onClose, onDone }) => {
  const [categoriesWithThresholds, setCategoriesWithThresholds] = useState([]);
  const [categoryTaxonomicPath, setCategoryTaxonomicPath] = useState("");

  const fetchThresholds = async () => {
    const response = await fetch("/api/business/liquidationRules/fetch");

    if (!response.ok) {
      return;
    }

    const thresholds = await response.json();
    setCategoriesWithThresholds(thresholds || []);
  };

  const addTaxonomicCategory = () => {
    let alreadyExists;
    if (categoryTaxonomicPath) {
      if (categoriesWithThresholds) {
        alreadyExists = categoriesWithThresholds.some(
          (category) => category.name === categoryTaxonomicPath
        );
      }
      if (!alreadyExists) {
        const newCategory = { name: categoryTaxonomicPath, days: 90 };
        setCategoriesWithThresholds([...categoriesWithThresholds, newCategory]); // Corrected this line
        setCategoryTaxonomicPath("");
      } else {
        NotificationManager.error(
          `Category "${categoryTaxonomicPath}" already exists.`
        );
      }
    }
  };

  const removeCategoryById = async (idToRemove) => {
    const response = await fetch("/api/business/liquidationRules/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idToRemove),
    });

    const filteredCategories = categoriesWithThresholds.filter(
      (category) => category.id !== idToRemove
    );
    setCategoriesWithThresholds(filteredCategories);
  };

  const updateCategoryThreshold = (categoryName, newThreshold) => {
    const updatedCategories = categoriesWithThresholds.map((category) => {
      if (category.name === categoryName) {
        return { ...category, days: newThreshold };
      }
      return category;
    });
    setCategoriesWithThresholds(updatedCategories);
  };

  const onSave = async () => {
    const response = await fetch("/api/business/liquidationRules/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriesWithThresholds),
    });
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

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
        <div className=" rounded-2xl mt-4 py-3 px-3 border shadow-sm">
          <h1 className="text-xl text-black text-center">
            Liquidation Thresholds
          </h1>
          <div className="mt-4 flex justify-center items-center gap-3">
            <SelectCategory
              setCategoryTaxonomicPath={setCategoryTaxonomicPath}
            />

            <button
              onClick={addTaxonomicCategory}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Add Category
            </button>
          </div>
          {categoriesWithThresholds && categoriesWithThresholds.length !== 0 ? (
            <div>
              <div className="flex items-center justify-end  mt-3">
                <h1 className="pr-[36px] font-medium">Days</h1>
              </div>
              {/* map */}
              {categoriesWithThresholds.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between mt-2"
                >
                  <div className="flex items-center">
                    <svg
                      onClick={() => removeCategoryById(category.id)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4 cursor-pointer hover:opacity-70 text-red-500 mr-[10px]"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>

                    <h1 className="pr-2 font-medium">{category.name}</h1>
                  </div>
                  <input
                    value={category.days}
                    onChange={(e) =>
                      updateCategoryThreshold(category.name, e.target.value)
                    }
                    className="font-medium px-2 py-1 border focus:ring-1 focus:ring-primary border-primary focus:outline-none text-black rounded-xl w-28 h-10"
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
