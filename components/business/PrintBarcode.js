import Barcode from "react-barcode";
import { QRCode } from "react-qrcode-logo";
import { useState } from "react";

const PrintBarcode = ({ sku, price }) => {
  const [template, setTemplate] = useState("1");

  return (
    <div className="flex flex-col items-center container mx-auto p-4">
      <div className="border-[5px] border-gray-700 rounded-3xl px-8 py-4">
        <div id="barcode-to-print" className="print:barcode-container flex">
          {template === "1" && (
            <>
              <div className="flex flex-col items-center">
                <h6 className="w-2/3 text-center text-sm">Members Price</h6>
                <QRCode value={`$${price}`} size={60} />
              </div>
              <div className="ml-2 border-l-2 border-black"></div>
              <div className="flex flex-col items-center justify-center">
                <div className="mr-3">{`$${price}`}</div>
                <Barcode width={1} height={25} value={sku} fontSize={10} />
              </div>
            </>
          )}
          {template === "2" && (
            <>
              <div className="price-text tp-2 mb-2 ">{`$${price}`}</div>
              <Barcode width={1} height={25} value={sku} fontSize={10} />
            </>
          )}
          {template === "3" && (
            <>
              <h6 className="price-text">Members Price</h6>
              <QRCode value={`$${price}`} />
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Print Barcode
      </button>

      <label className="mt-5 text-lg">Template</label>
      <select
        value={template}
        className="mt-1 rounded-xl px-3 py-2 border border-gray-600"
        onChange={(e) => setTemplate(e.target.value)}
      >
        <option value={"1"}>QR & Barcode</option>
        <option value={"2"}>Barcode Only</option>
        <option value={"3"}>QR Code Only</option>
      </select>

      <style>
        {`
          .price-text {
            font-size: 16px;
            align-self: center;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-size: 20px;
            white-space: nowrap;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            #barcode-to-print, #barcode-to-print * {
              visibility: visible;

            }
            .print\\:barcode-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 57mm;
                height: 32mm;
                display: flex;
                align-items: center;
                justify-content: evenly; horizontally
              }
            .print\\:price-text {
                margin-bottom: 20px
            }

            .print\\:barcode-container > div:nth-child(2) {
                border-left: 2px solid black;
                height: 30mm;
                margin: 0 4mm;
          }
        `}
      </style>
    </div>
  );
};

export default PrintBarcode;
