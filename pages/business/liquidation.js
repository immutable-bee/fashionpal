import { useState } from "react";
import ButtonComponent from "@/components/utility/Button";
import Scanner from "@/components/scoped/Scanner";
import { NotificationManager } from "react-notifications";
import Barcode from "react-barcode";
import ModalComponent from "@/components/utility/Modal";
import cloneDeep from "lodash.clonedeep";
import Head from "next/head";

const Liquidation = () => {
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

  const [skusToLiquidate, setSkusToLiquidate] = useState([]);
  const [skuToDispose, setSkuToDispose] = useState();
  const [skusLiquidated, setSkusLiquidated] = useState([]);

  const onNewScanResult = (decodedText) => {
    const sku = cloneDeep(decodedText);

    setActiveSKU(sku);

    fetchListingBySku(decodedText);
  };

  const handleSkuInput = (e) => {
    e.preventDefault();

    if (!activeSKU) {
      NotificationManager.error("SKU is required!");
      return;
    }

    fetchListingBySku(activeSKU);
  };

  const triggerConfirmModal = (e) => {
    setSkuToDispose(e);
    setConfirmModal(true);
    setConfirmModalType("DISPOSED");
  };

  const triggerConfirmFinishModal = () => {
    setConfirmModal(true);
    setConfirmModalType("FINISH");
  };

  const onConfirmed = () => {
    if (confirmModalType === "DISPOSED") {
      onDispose(skuToDispose);
    } else {
      setStep(3);
      setConfirmModal(false);
      setConfirmModalType("");
    }
  };

  const onDispose = async () => {
    setLoading(true);

    const response = await fetch(
      `/api/business/listing/liquidate/${skuToDispose}`
    );
    if (!response.ok) {
      return;
    }

    setSkusToLiquidate(
      skusToLiquidate.map((sku) =>
        sku.sku === skuToDispose ? { ...sku, disposed: true } : sku
      )
    );

    setSkusLiquidated([...skusLiquidated, skuToDispose]);

    setConfirmModal(false);
    setConfirmModalType("");

    setLoading(false);
  };

  const onFinish = async () => {
    setStep(3);
  };

  const fetchListingBySku = async (e) => {
    console.log(e);

    // Define the expected format using a regular expression
    const skuFormatRegex = /^\d{14}$/;

    // Check if the user-entered SKU matches the expected format
    if (!skuFormatRegex.test(e)) {
      NotificationManager.error(
        "Entered SKU does not match the expected format, You need to scan the sku label not the link label"
      );
      return;
    }
    setUpdating(true);
    const response = await fetch(
      "/api/business/listing/liquidate/fetchListingBySku",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(e),
      }
    );
    setUpdating(false);

    if (!response.ok) {
    }
    const data = (await response.json())[0];

    const differenceInDays = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const differenceInTime = now.getTime() - date.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

      return differenceInDays;
    };
    const daysSince = differenceInDays(data.createdAt);

    const newSkuObject = {
      sku: data.Barcode,
      type: "FINISH",
      price: data.price,
      disposed: false,
      daysSince,
    };
    setSkusToLiquidate([...skusToLiquidate, newSkuObject]);
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
      <Head>
        <title>Liquidation</title>
      </Head>
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
                <div className="flex py-2 justify-evenly">
                  {skusToLiquidate.length > 0 && (
                    <h6>Listings added: {skusToLiquidate.length}</h6>
                  )}
                  {skusLiquidated.length > 0 && (
                    <h6>Listings Liquidated: {skusLiquidated.length}</h6>
                  )}
                </div>
                <div className="text-lg  text-center rounded-2xl border px-3 py-2">
                  Scan with barcode scanner or phones camera
                </div>
              </div>
            )}
            <div className="px-3 sm:py-3">
              <form onSubmit={handleSkuInput}>
                <div className="mt-8">
                  <label className=" text-base">Barcode scanner(SKU)</label>
                  <div className="flex items-center gap-1">
                    <input
                      placeholder="100523-0048"
                      type="text"
                      className="mt-1 w-full rounded-xl px-3 py-2 border border-gray-600"
                      onChange={(e) => {
                        setActiveSKU(e.target.value);
                      }}
                    />
                    <button
                      className={updating && " pointer-events-none opacity-70"}
                      type="submit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-10 h-10 text-primary"
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

            {skusToLiquidate.map((sku) => (
              <div
                key={sku.sku}
                className="mt-8 px-3 sm:py-3 flex flex-col "
              >
                <div
                  className={`sm:rounded-t-2xl px-3 py-2 ${
                    days < liquidationThreshold ? "bg-green-400" : "bg-red-500"
                  }`}
                >
                  <h3 className="text-lg text-gray-700 text-center">
                    SKU: <span className="font-medium">{sku.sku}</span>
                  </h3>
                  {sku.disposed ? (
                    <h2 className="text-2xl text-center text-gray-800">
                      DISPOSED
                    </h2>
                  ) : (
                    <>
                      <h3 className="text-lg text-gray-700 text-center">
                        Category:{" "}
                        <span className="font-medium">{category}</span>
                      </h3>
                      <h2 className="text-2xl text-center text-gray-800">
                        {sku.daysSince} Days
                      </h2>
                    </>
                  )}
                </div>
                {!sku.disposed && (
                  <h3 className="text-sm mt-0.5 mr-2 text-gray-700 text-right">
                    Liquidation Threshold:{" "}
                    <span className="font-medium">
                      {liquidationThreshold} Days
                    </span>
                  </h3>
                )}
                {!sku.disposed && (
                  <>
                    <div className="text-lg text-center rounded-2xl border px-3 py-2">
                      <div className="price-text">{`$${sku.price}`}</div>
                      <div className="w-full mx-auto max-w-fit">
                        <Barcode
                          width={1}
                          height={60}
                          value={sku.sku}
                          fontSize={10}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center mt-2">
                      <button
                        onClick={() => triggerConfirmModal(sku.sku)}
                        className={`${
                          isDisposed ? " pointer-events-none bg-gray-300" : ""
                        } hover:bg-red-500 max-w-[150px] mx-auto hover:text-white duration-250 min-w-[100px] ease-in-out  rounded-xl px-10 text-xl py-2.5  border-2 border-red-500`}
                      >
                        Dispose
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="flex flex-wrap flex-col gap-3 mt-8 px-3 sm:py-3">
              {skusToLiquidate && skusToLiquidate.length !== 0 && (
                <button
                  disabled={tagFetching}
                  onClick={() => triggerConfirmFinishModal()}
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
                      <td className="px-6 py-4">{skusLiquidated.length}</td>
                      <td className="px-6 py-4">{skusToLiquidate.length}</td>
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

export default Liquidation;
