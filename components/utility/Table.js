import React from "react";
import CheckboxComponent from "../utility/Checkbox";

const Table = ({
  isCheckbox,
  headers,
  rows,
  selectedRows,
  setSelectedRows,
  sortDescriptor,
  setSortDescriptor,
  children,
}) => {
  const handleCheckboxChange = (value) => {
    if (selectedRows.includes(value)) {
      setSelectedRows(selectedRows.filter((id) => id !== value));
    } else {
      setSelectedRows([...selectedRows, value]);
    }
  };

  const handleSortChange = (column) => {
    if (sortDescriptor.column === column.key) {
      setSortDescriptor({
        ...sortDescriptor,
        direction:
          sortDescriptor.direction === "ascending"
            ? "descending"
            : "ascending",
      });
    } else {
      setSortDescriptor({
        direction: "ascending",
        column: column.key,
      });
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl border-2 min-h-[400px] p-3">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-500 rounded-lg font-semibold bg-gray-100">
          <tr>
            {isCheckbox && (
              <th scope="row" className="px-3 py-1.5 whitespace-nowrap">
                <CheckboxComponent
                  isSelected={rows.length !== 0 && selectedRows.length === rows.length}
                  boolean={true}
                  onChange={(e) => {
                    const { checked } = e.target;
                    if (checked) {
                      setSelectedRows(
                        rows.map((transaction) => transaction.id)
                      );
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </th>
            )}

            {headers.map((header) => (
              <th
                key={header.key}
                scope="row"
                className={`px-3 py-1.5 whitespace-nowrap ${header.allowsSorting ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                onClick={() => header.allowsSorting && handleSortChange(header)}
              >
                <div className="flex justify-between items-center min-w-[4rem]">
                  <span>{header.label}</span>
                  {header.allowsSorting && sortDescriptor.column === header.key && (
                    <div className="bg-sky-600 rounded-full w-4 h-4 cursor-pointer hover:bg-opacity-90 flex-shrink-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`w-2.5 h-3.5 text-white ${sortDescriptor.direction === "ascending"
                          ? "transform rotate-180"
                          : ""
                          }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
