import Barcode from "react-barcode";
import { QRCode } from "react-qrcode-logo";
import { useState } from "react";

const PrintBarcode = ({ sku, price }) => {
  const [template, setTemplate] = useState(1);

  return (
    <>
      <div className="flex flex-col items-center container mx-auto p-4">
        <div className="border-[5px] border-gray-700 rounded-3xl px-8 py-4">
          <div id="barcode-to-print" className="print:barcode-container">
            {template === "1" && (
              <div className="print:qr-container flex flex-col items-center">
                <h6 className="price-text">Sku</h6>
                <QRCode value={`$${sku}`} size={75} />
              </div>
            )}
            {template === "2" && (
              <div className="print:qr-container flex flex-col items-center">
                <h6 className="price-text">Members Price</h6>
                <QRCode value={`$${price}`} size={75} />
              </div>
            )}
            {template === "3" && (
              <div className="w-full h-full flex flex-col items-center">
                <div className="price-text ">{`$${price}`}</div>
                <div className="w-full">
                  <Barcode width={1.3} height={40} value={sku} fontSize={10} />
                </div>
              </div>
            )}
            {template === "4" && (
              <div className="print:qr-container flex flex-col items-center">
                <h6 className="price-text">Members Price</h6>
                <QRCode value={`$${price}`} size={75} />
              </div>
            )}
            {template === "5" && (
              <div className="flex">
                <div className="print:qr-container flex flex-col items-center">
                  <h6 className="w-2/3 text-center text-sm">Members Price</h6>
                  <QRCode value={`$${price}`} size={75} />
                </div>
                <div className="ml-2 border-l-2 border-black"></div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full mr-3">{`$${price}`}</div>
                  <Barcode width={1} height={25} value={sku} fontSize={10} />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Print Label
        </button>

        <label className="mt-5 text-lg">Template</label>
        <select
          value={template}
          className="mt-1 rounded-xl px-3 py-2 border border-gray-600"
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value={"1"}>QR Code (Sku) 1x1</option>
          <option value={"2"}>QR Code (Product Link) 1x1</option>
          <option value={"3"}>Barcode (Sku) 1.25 x 2.25</option>
          <option value={"4"}>QR Code (Product Link) 1.25 x 2.25</option>
          <option value={"5"}>Barcode & QR Code 4 x 6</option>
        </select>

        <style>
          {`
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
            #barcode-to-print, #barcode-to-print * {
              visibility: visible;
            }
            @page {
              margin-top: 15px;

              size: auto;

            }
            html, body {
              height: 100vh;
              overflow: hidden;
              margin: 0;
              padding: 0;
            }

            .print\\:barcode-container {
              position: absolute;
              max-width: 100vw;
              max-height: 100vh;
              top: 0;
              left: 25px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .print\\:qr-container {
              margin-left: 10px
            }

            .print\\:barcode-container > div {
              max-width: 100%;
              max-height: 100%;
            }
          }
        `}
        </style>
      </div>
    </>
  );
};

export default PrintBarcode;
