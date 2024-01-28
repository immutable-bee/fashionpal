import { useState, useEffect } from "react";
import { topLevelCategories } from "../../constants/categories";
import { secondLevelCategories } from "../../constants/categories";
import { thirdLevelCategories } from "../../constants/categories";

const SelectCategory = ({
  categoryParams,
  setCategoryParams,
  defaultTopOption = true,
  setCategoryTaxonomicPath,
}) => {
  const [tierOneCategory, setTierOneCategory] = useState("");
  const [tierTwoCategory, setTierTwoCategory] = useState("");
  const [tierThreeCategory, setTierThreeCategory] = useState("");

  const handleCategoryParams = () => {
    const taxonomicPath = tierThreeCategory
      ? `${tierOneCategory}/${tierTwoCategory}/${tierThreeCategory}`
      : tierTwoCategory
      ? `${tierOneCategory}/${tierTwoCategory}`
      : tierOneCategory
      ? tierOneCategory
      : null;

    if (setCategoryTaxonomicPath) {
      setCategoryTaxonomicPath(taxonomicPath);
    } else {
      let newParams = {
        ...categoryParams,
        top: tierOneCategory,
        sub: tierTwoCategory || null,
        name: tierThreeCategory || tierTwoCategory || tierOneCategory,
        taxonomicPath,
      };
      setCategoryParams(newParams);
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string" || string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    handleCategoryParams();
  }, [tierOneCategory, tierTwoCategory, tierThreeCategory]);

  return (
    <>
      <div className="sm:w-96 mx-auto">
        <label className="text-lg">Category</label>
        <select
          value={tierOneCategory}
          className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
          onChange={(e) => setTierOneCategory(e.target.value)}
        >
          {defaultTopOption && <option value={""}>Select Category</option>}
          {topLevelCategories.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>

      {tierOneCategory && secondLevelCategories[tierOneCategory] && (
        <div className="sm:w-96 mx-auto">
          <label className="text-lg">Subcategory</label>
          <select
            value={tierTwoCategory}
            className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
            onChange={(e) => setTierTwoCategory(e.target.value)}
          >
            <option value={""}>None</option>
            {secondLevelCategories[tierOneCategory].map((subcategory) => {
              return (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {tierTwoCategory && thirdLevelCategories[tierTwoCategory] && (
        <div className="sm:w-96 mx-auto">
          <label className="text-lg">Subcategory</label>
          <select
            value={tierThreeCategory}
            className="w-full mt-1 rounded-xl px-3 py-2 border border-gray-600"
            onChange={(e) => setTierThreeCategory(e.target.value)}
          >
            <option value={""}>None</option>
            {thirdLevelCategories[tierTwoCategory].map((subcategory) => {
              return (
                <option key={subcategory} value={subcategory}>
                  {capitalizeFirstLetter(subcategory)}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </>
  );
};

export default SelectCategory;
