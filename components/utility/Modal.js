import React from "react";

const Modal = ({
  open,
  title,
  onClose,
  children,
  width,
  footer,
  buttonAlign = "center",
}) => {
  const alignMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };
  const onBackgroundClick = (event) => {
    if (event.target.id === "modal") onClose; // Close if clicked outside modal
  };

  return open ? (
    <>
      <div
        id="modal"
        onClick={onBackgroundClick}
        className="fixed inset-0 bg-black opacity-50 z-[10000]"
      ></div>{" "}
      {/* Overlay */}
      <div
        id="modal"
        onClick={onBackgroundClick}
        className="fixed flex items-center justify-center top-0 left-0 right-0 z-[10000] w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div
          style={{ maxWidth: `${width}` }}
          className="relative modal-content-custom w-full max-w-full sm:max-w-lg max-h-full"
        >
          <div className="relative bg-white rounded-lg max-h-[90vh] overflow-y-auto shadow dark:bg-gray-700">
            <div className="flex items-start justify-between px-4 py-2 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">{children}</div>
            {footer ? (
              <div
                class={`${alignMap[buttonAlign]} flex items-center px-4 py-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600`}
              >
                {footer}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default Modal;
