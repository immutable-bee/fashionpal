import React, { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import SimpleListingForm from "@/components/scoped/SimpleListingForm";
import EmployeeListingForm from "@/components/scoped/EmployeeListingForm";
import AdminListingForm from "@/components/scoped/AdminListingForm";

function ImageUploader({ onBack, onFecth }) {
  const [type, setType] = useState("simple");
  const [step, setStep] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-5 pb-8 pt-6">
      <div className="flex items-center">
        <svg
          onClick={onBack}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <h3 className="ml-3 text-2xl">Add listing</h3>
      </div>

      {step === 0 ? (
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-center mt-5">
            <button
              onClick={() => setType("simple")}
              className={`${
                type === "simple" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Simple
            </button>
            <button
              onClick={() => setType("employee")}
              className={`${
                type === "employee" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Employee
            </button>
            <button
              onClick={() => setType("admin")}
              className={`${
                type === "admin" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Admin
            </button>
          </div>

          <ButtonComponent
            full
            onClick={() => setStep(1)}
            className={`mt-16 mx-auto !w-64 rounded-lg !text-black`}
          >
            Next
          </ButtonComponent>
        </div>
      ) : (
        ""
      )}

      {type === "admin" && step === 1 ? (
        <AdminListingForm
          onBack={onBack}
          onFecth={onFecth}
        />
      ) : (
        ""
      )}

      {type === "employee" && step === 1 ? (
        <EmployeeListingForm
          onBack={onBack}
          onFecth={onFecth}
        />
      ) : (
        ""
      )}

      {type === "simple" && step === 1 ? (
        <SimpleListingForm
          onBack={onBack}
          onFecth={onFecth}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ImageUploader;
