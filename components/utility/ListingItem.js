import Image from "next/image";
import placeholder from "@/public/favicon.ico";

function ListingItem({
  mainPhoto,
  brandPhoto,
  status,
  tags = [],
  children = "",
  clickable = false,
  isSlot = true,
  Barcode,
  price,
  tinyUrl,
  printSKU,
}) {
  const stopClick = (event) => {
    event.stopPropagation();
  };
  const getTabClass = () => {
    switch (status) {
      case "SALE":
        return "bg-green-400";
      case "DISPOSED":
        return "bg-red-600";
      case "DAMAGED":
        return "bg-amber-300";
      default:
        return "bg-green-400";
    }
  };
  return (
    <div
      className={`px-4 py-4 sm:!w-64 overflow-hidden w-[calc(100%-15px)] relative rounded-3xl group [perspective:1000px] mx-auto my-2 ${
        clickable ? "cursor-pointer hover:opacity-90 " : ""
      } `}
      style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)" }}
    >
      <div
        className={`relative h-[255px] w-full rounded-xl shadow-xl transition-all duration-500 ease-in-out ${
          brandPhoto
            ? "[transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
            : ""
        }`}
      >
        <div className="absolute inset-0">
          <Image
            src={mainPhoto || placeholder}
            width={100}
            height={100}
            className="rounded-xl !w-full !h-64 object-cover"
            alt=""
          />
        </div>
        {brandPhoto ? (
          <div className="absolute inset-0 h-full w-full rounded-xl text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <Image
              src={brandPhoto}
              width={100}
              height={100}
              className="rounded-xl !w-full !h-64 object-cover"
              alt=""
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {tags &&
          tags.length !== 0 &&
          tags.slice(0, 3).map((tag, tagIndex) => (
            <p
              key={tagIndex}
              className={`text-gray-200 max-w-fit px-2 py-1 rounded text-base leading-5 ${getTabClass()}`}
            >
              {tag}
            </p>
          ))}
        {isSlot && children ? (
          <div
            className="mt-1.5"
            onClick={stopClick}
          >
            {children}
          </div>
        ) : (
          ""
        )}
        {status === "SALE" && (
          <button
            onClick={(e) => printSKU(e, Barcode, price, tinyUrl)}
            className={`hover:bg-green-500 hover:text-white duration-250 min-w-[10px] ease-in-out leading-5 rounded-lg px-4 text-base py-1  border-2 border-green-500`}
          >
            Print
          </button>
        )}
      </div>
    </div>
  );
}

export default ListingItem;
