import Barcode from "react-barcode";

const PrintBarcode = ({ sku }) => {
  return (
    <div className="flex flex-col items-center container mx-auto p-4">
      <div className="border-[5px] border-gray-700 rounded-3xl px-8 py-2">
        <div id="barcode-to-print" className="print:barcode-container">
          <Barcode value={sku} />
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Print Barcode
      </button>

      <style>
        {`
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
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintBarcode;
