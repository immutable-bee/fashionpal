import { useMemo, useState } from "react";
import Barcode from "react-barcode";
import { QRCode } from "react-qrcode-logo";

const PrintBarcode = ({ sku, price, tinyUrl }) => {
  const [template, setTemplate] = useState("1");

  const skuWithBaseURL = useMemo(() => {
    const baseUrl = window.location.origin || ""; // Replace with the actual property name

    return `${baseUrl}/scan/`;
  }, [window]);

  return (
    <>
      <div className="flex flex-col min-h-[460px] items-center container mx-auto ">
        <label className=" text-lg">Template</label>
        <select
          value={template}
          className="mt-1  rounded-xl px-3 py-2 border border-gray-600"
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value={"1"}>QR Code (Sku) 1x1</option>
          <option value={"2"}>QR Code (Product Link) 1x1</option>
          <option value={"3"}>Barcode (Sku) 1.25 x 2.25</option>
          <option value={"4"}>QR Code (Product Link) 1.25 x 2.25</option>
          <option value={"5"}>Barcode & QR Code 4 x 6</option>
        </select>

        <div className="border-[5px] mt-5 border-gray-700 rounded-3xl px-8 py-4">
          <div id="barcode-to-print" className="print:barcode-container">
            {template === "1" && (
              <div className="print:qr-container print:qr-code print:sku flex flex-col items-center">
                <h6 className="price-text font-bold">{`$${price}`}</h6>

                <QRCode value={sku} size={175} />
              </div>
            )}
            {template === "2" && (
              <div className="print:qr-container print:qr-code flex flex-col items-center">
                <h6 className="label-text font-bold">Member Price</h6>

                <QRCode value={tinyUrl} size={175} />
              </div>
            )}
            {template === "3" && (
              <div className="w-full h-full flex flex-col items-center print:qr-container print:barcode">
                <h6 className="price-text font-bold">{`$${price}`}</h6>
                <Barcode width={2} height={60} value={sku} fontSize={16} />
              </div>
            )}
            {template === "4" && (
              <div className="print:qr-container print:qr-code flex flex-col items-center">
                <h6 className="label-text font-bold">Member Price</h6>

                <QRCode value={tinyUrl} size={175} />
              </div>
            )}
            {template === "5" && (
              <div className="sm:flex print:qr-container print:double-code flex">
                <div className="flex-1 flex flex-col items-center print:qr-code">
                  <h6 className="w-full text-center text-sm font-bold label-text">
                    Member Price
                  </h6>
                  <QRCode value={tinyUrl} size={175} />
                </div>
                <div className="mt-2 mb-2 sm:mb-0 sm:ml-2 sm:border-l-2 border-t-2 border-black print:min-h-[60%]"></div>
                <div className="flex-1 flex flex-col items-center justify-center print:barcode">
                  <h6 className="w-full text-center font-bold price-text">{`$${price}`}</h6>
                  <Barcode width={2} height={55} value={sku} fontSize={16} />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Print Label
        </button>

        <style>
          {`
          .label-text {
            font-size: 14px;
            white-space: nowrap;
          }
          .price-text {
            font-size: 14px;
            white-space: nowrap;
          }
          @media print {
            header, footer, aside, form {
              display: none;
            }

            body * {
              visibility: hidden;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #barcode-to-print, #barcode-to-print * {
              visibility: visible;
            }

            @page {
              size: auto;
            }

            html, body {
              height: 100vh;
              overflow: hidden;
              margin: 0;
              padding: 0;
            }

            .label-text {
              font-size: 11px;
              white-space: nowrap;
            }

            .price-text {
              font-size: 32px;
              white-space: nowrap;
            }

            .print\\:barcode-container {
              position: absolute;
              width: 100% !important;
              height: 100% !important;
              top: 0;
              left: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            .print\\:barcode-container > div {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              margin-top: -8%;
            }

            .print\\:barcode-container .print\\:qr-code > canvas {
              width: auto !important;
              height: 76% !important;
            }

            .print\\:barcode-container .print\\:qr-code {
              transform: rotate(90deg) !important;
            }

            .print\\:barcode-container .print\\:sku .price-text {
              font-size: 18px;
            }

            .print\\:barcode-container .print\\:barcode {
              padding-top: 2%;
            }

            .print\\:barcode-container .print\\:barcode > svg {
              width: 82% !important;
              height: auto !important;
              margin-top: 0 !important;
            }

            .print\\:barcode-container .print\\:double-code > div > .label-text {
              font-size: 8px;
            }

            .print\\:barcode-container .print\\:double-code > div > .price-text {
              font-size: 16px;
            }

            .print\\:barcode-container .print\\:double-code .print\\:qr-code > canvas {
              width: 80% !important;
              height: auto !important;
            }
          }
        `}
        </style>
      </div>
    </>
  );
};

export default PrintBarcode;
