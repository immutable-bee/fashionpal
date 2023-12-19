import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import CreateNewRule from "@/components/scoped/CreateNewRule";
import EditRule from "@/components/scoped/EditRule";
import ReportDashboard from "@/components/scoped/ReportDashboard";

const RePricer = () => {
  const [listType, setListType] = useState("rule");
  const [islistTypeSelected, setIsListTypeSelected] = useState(false);
  return (
    <div>
      {!islistTypeSelected ? (
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-center mt-5">
            <button
              onClick={() => setListType("rule")}
              className={`${
                listType === "rule" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-8 sm:px-10 text-xl py-2 sm:py-2.5  border border-gray-300`}
            >
              Rules
            </button>
            <button
              onClick={() => setListType("create")}
              className={`${
                listType === "create" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-8 sm:px-10 text-xl py-2 sm:py-2.5  border border-gray-300`}
            >
              Create rule
            </button>
            <button
              onClick={() => setListType("report")}
              className={`${
                listType === "report" ? "bg-primary text-white" : "bg-white"
              } duration-250 ease-in-out rounded-xl px-8 sm:px-10 text-xl py-2 sm:py-2.5  border border-gray-300`}
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
          {listType === "create" ? (
            <CreateNewRule onBack={() => setIsListTypeSelected(false)} />
          ) : (
            ""
          )}
          {listType === "rule" ? (
            <EditRule onBack={() => setIsListTypeSelected(false)} />
          ) : (
            ""
          )}
          {listType === "report" ? (
            <ReportDashboard onBack={() => setIsListTypeSelected(false)} />
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default RePricer;
