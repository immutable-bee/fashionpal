import { useState, useEffect } from "react";
import Image from "next/image";
import ModalComponent from "@/components/utility/Modal";
import { NotificationManager } from "react-notifications";
import ButtonComponent from "@/components/utility/Button";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
function ProductDetails({ open, onClose, tags, listingId, onFetch }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(tags || []);
  }, [tags]);

  const onSave = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/business/listing/edit-listing`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: listingId,
          tags: data,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error("Failed to save tags.");
      }
      onClose();
      onFetch();

      NotificationManager.success("Tag updated successfully!");
      setLoading(false);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {open ? (
        <ModalComponent
          open={open}
          title="Edit Tags"
          onClose={() => onClose()}
          footer={
            <div className="flex justify-end w-full">
              <ButtonComponent
                rounded
                className="!mx-1"
                loading={loading}
                onClick={() => onSave()}
              >
                Save
              </ButtonComponent>
              <ButtonComponent
                rounded
                className="!mx-1"
                onClick={() => onClose()}
              >
                Close
              </ButtonComponent>
            </div>
          }
        >
          <TagsInput
            value={data}
            onChange={(e) => setData(e)}
          />
        </ModalComponent>
      ) : (
        ""
      )}
    </div>
  );
}

export default ProductDetails;
