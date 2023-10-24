import ModalComponent from "@/components/utility/Modal";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
function ProductDetails({ open, onClose, data, setTags }) {
  return (
    <div>
      {open ? (
        <ModalComponent
          open={open}
          title="Edit Tags"
          onClose={() => onClose()}
          footer={
            <div className="flex justify-end w-full">
              <button
                className=" bg-primary px-4 py-1.5 mt-2 rounded-lg text-white"
                onClick={() => onClose()}
              >
                Close
              </button>
            </div>
          }
        >
          <TagsInput
            value={data}
            onChange={(e) => setTags(e)}
          />
        </ModalComponent>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProductDetails;
