import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import CreateNewRule from "@/components/scoped/CreateNewRule";
import EditRule from "@/components/scoped/EditRule";
import ReportDashboard from "@/components/scoped/ReportDashboard";

const RePricer = () => {
  const [listType, setListType] = useState("create");
  const [islistTypeSelected, setIsListTypeSelected] = useState(false);
  return (
    <div>
      {!islistTypeSelected ? (
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-center mt-5">
            <button
              onClick={() => setListType("create")}
              className={`${
                listType === "create" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Create rule
            </button>
            <button
              onClick={() => setListType("edit")}
              className={`${
                listType === "edit" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Edit rule
            </button>
            <button
              onClick={() => setListType("report")}
              className={`${
                listType === "report" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-10 text-xl py-2.5  border border-gray-300`}
            >
              Report dashboard
            </button>
          </div>

          <ButtonComponent
            full
            onClick={() => setIsListTypeSelected(true)}
            className={`mt-16 mx-auto !w-64 rounded-lg !text-black`}
          >
            Next
          </ButtonComponent>
        </div>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 bg-gray-300 border border-gray-600 rounded-full p-1.5 cursor-pointer"
            onClick={() => setIsListTypeSelected(false)}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          {listType === "create" ? <CreateNewRule /> : ""}
          {listType === "edit" ? <EditRule /> : ""}
          {listType === "report" ? <ReportDashboard /> : ""}
        </>
      )}
    </div>
  );
};

export default RePricer;
