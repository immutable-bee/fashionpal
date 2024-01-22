import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BusinessPage = () => {
  const router = useRouter();

  const [businessData, setBusinessData] = useState();

  const fetchBusinessData = async (id) => {
    const response = await fetch(`/api/business/fetchData/${id}`);

    if (!response.ok) {
    }

    const data = await response.json();
    setBusinessData(data);
  };

  const onFollow = async (req, res) => {
    const response = await fetch("/api/consumer/followBusiness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(businessData.id),
    });

    if (!response.ok) {
    }
    return;
  };

  const onUnfollow = async () => {};

  useEffect(() => {
    const initialFetch = async (id) => {
      await fetchBusinessData(id);
    };
    if (router.query.id) {
      initialFetch(router.query.id);
    }
  }, [router.query]);
  return (
    <div>
      <h6>Business</h6>
      {businessData?.isFollowing ? (
        <Button onclick={onUnfollow}>Unfollow</Button>
      ) : (
        <Button onClick={onFollow}>Follow</Button>
      )}
    </div>
  );
};

export default BusinessPage;
