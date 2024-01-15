import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import Scanner from "@/components/scoped/Scanner";
import { NotificationManager } from "react-notifications";
import Barcode from "react-barcode";
import ModalComponent from "@/components/utility/Modal";

const PrintBarcode = () => {
  const [sku, setSKU] = useState("");
  const [activeSKU, setActiveSKU] = useState("");
  const [step, setStep] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [price, setPrice] = useState(0);
  const [tagFetching, setTagFetching] = useState(false);
  const [isDisposed, setIsDisposed] = useState(false);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState("");
  const [category, setCategory] = useState("Clothing");
  const [days, setDays] = useState(96);
  const [liquidationThreshold, setLiquidationThreshold] = useState(90);

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log(decodedText);
    console.log(decodedResult);

    var match = decodedText.match(/\/([^\/]+)$/);

    var id = match ? match[1] : null;

    setActiveSKU(id);
    setIsDisposed(false);
    setScans((prevScans) => [...prevScans, { sku: activeSKU, type: "FINISH" }]);
    setStep(2);

    // handle decoded results here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sku) {
      NotificationManager.error("SKU is required!");
      return;
    }

    setUpdating(true);
    setActiveSKU(sku);
    setIsDisposed(false);
    setScans((prevScans) => [...prevScans, { sku: activeSKU, type: "FINISH" }]);

    setSKU("");
    setStep(2);
    // try {
    //   await fetch("/api/business/updateData", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: businessData.email,
    //       data: {
    //         businessName: businessData.businessName,
    //         squareAccessToken: businessData.squareAccessToken,
    //       },
    //     }),
    //   });
    //   await fetchBusinessData();
    // } catch (error) {}
    setUpdating(false);
  };

  const triggerConfirmModal = (e) => {
    setConfirmModal(true);
    setConfirmModalType(e);
  };

  const onConfirmed = () => {
    if (confirmModalType === "DISPOSED") {
      onDispose();
    } else {
      pushQueuedListing();
    }
  };

  const onDispose = () => {
    // Make a copy of the scans array to avoid mutating the state directly
    const newScans = [...scans];

    // Check if there are any items in the scans array
    if (newScans.length > 0) {
      // Update the type of the last item to "DISPOSE"
      newScans[newScans.length - 1].type = "DISPOSED";

      // Update the state with the modified scans array
      setScans(newScans);
    }

    setIsDisposed(true);
    setConfirmModal(false);
    setConfirmModalType("");
  };

  const onFinish = async () => {
    setLoading(true);

    const payload = {
      scans,
    };
    console.log(payload);

    // const response = await fetch("/api/business/listing/pushQueuedListing", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // });

    // if (!response.ok) {
    //   return;
    // }

    setStep(3);
    setLoading(false);
  };

  const pushQueuedListing = () => {
    setConfirmModalType("");
    setConfirmModal(false);
    setStep(3);
    console.log(scans);
  };
  const onBack = async () => {
    setScans([]);

    setSKU("");
    setActiveSKU("");
    setConfirmModalType("");
    setConfirmModal(false);
    setStep(1);
  };

  return (
    <>
      <ModalComponent
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title={`Confirm ${
          confirmModalType === "DISPOSED" ? "Dispose" : "Finish"
        } `}
        footer={
          <div className="flex justify-end w-full">
            <ButtonComponent
              rounded
              id="close-unsubscribe-modal-btn"
              className="!mx-1 !px-5"
              loading={loading}
              onClick={() => onConfirmed()}
            >
              Yes
            </ButtonComponent>
          </div>
        }
      >
        <>
          <h4 className="text-base">
            Are you sure you want to{" "}
            {confirmModalType === "DISPOSED" ? "Dispose" : "Finish"}
          </h4>
        </>
      </ModalComponent>
      <div className="sm:w-96 sm:shadow pb-6 sm:rounded-xl  mx-auto  sm:mt-8 mb-10 ">
        {step !== 3 && (
          <>
            {step === 1 && (
              <div className="px-3 sm:py-3">
                <div className="text-lg  text-center rounded-2xl border px-3 py-2">
                  Scan with barcode scanner or phones camera
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <div
                  className={`sm:rounded-t-2xl px-3 py-2  ${
                    days < liquidationThreshold ? "bg-green-400" : "bg-red-500"
                  }`}
                >
                  <h3 className="text-lg text-gray-700 text-center">
                    SKU: <span className="font-medium">{activeSKU}</span>
                  </h3>
                  <h3 className="text-lg text-gray-700 text-center">
                    Category: <span className="font-medium">{category}</span>
                  </h3>
                  <h2 className="text-2xl text-center text-gray-800">
                    {days} Days
                  </h2>
                </div>

                <h3 className="text-sm mt-0.5 mr-2 text-gray-700 text-right">
                  Liquidation Threshold:{" "}
                  <span className="font-medium">
                    {liquidationThreshold} Days
                  </span>
                </h3>

                <div className="mt-8 px-3 sm:py-3">
                  <div className="text-lg  text-center rounded-2xl border px-3 py-2">
                    <div className="price-text ">{`$${price}`}</div>

                    <div className="w-full mx-auto max-w-fit ">
                      <Barcode
                        width={1}
                        height={60}
                        value={activeSKU}
                        fontSize={10}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="px-3 sm:py-3">
              <form onSubmit={handleSubmit}>
                <div className="mt-8">
                  <label className=" text-base">Barcode scanner(SKU)</label>
                  <div className="flex items-center gap-1">
                    <input
                      value={sku}
                      placeholder="100523-0048"
                      type="text"
                      className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-600"
                      onChange={(e) => setSKU(e.target.value)}
                    />
                    <button
                      className={updating && " pointer-events-none opacity-70"}
                      type="submit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-10 h-10 text-green-500"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
              <h2 className="text-xl my-3 text-center">Or</h2>
              <Scanner
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
              />
            </div>
            <div className="flex flex-wrap flex-col gap-3 mt-8 px-3 sm:py-3">
              {activeSKU && (
                <button
                  onClick={() => triggerConfirmModal("DISPOSED")}
                  className={`${
                    isDisposed ? " pointer-events-none bg-gray-300" : ""
                  } hover:bg-red-500 max-w-[150px] mx-auto hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-red-500`}
                >
                  Dispose
                </button>
              )}

              {scans && scans.length !== 0 && (
                <button
                  disabled={tagFetching}
                  onClick={() => triggerConfirmModal("FINISH")}
                  className={`${
                    tagFetching ? " pointer-events-none bg-gray-300" : ""
                  } hover:bg-green-500 mt-5 hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-green-500`}
                >
                  Finish
                </button>
              )}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="mx-4 pt-3">
              <h3 className="text-xl text-gray-700 text-center my-2">
                Summary
              </h3>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Disposed
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3"
                      >
                        Scanned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <td className="px-6 py-4">
                        {scans.filter((x) => x.type === "DISPOSED").length}
                      </td>
                      <td className="px-6 py-4">
                        {scans.filter((x) => x.type === "FINISH").length}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center  mt-1">
                <ButtonComponent
                  rounded
                  className="!w-48 mt-6"
                  onClick={() => onBack()}
                >
                  Go back
                </ButtonComponent>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PrintBarcode;
