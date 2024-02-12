import QueuedListings from "../../components/business/QueuedListings";
import Head from "next/head";

const ListingQueue = () => {
  return (
    <>
      <Head>
        <title>Queued Listings</title>
      </Head>
      <QueuedListings />
    </>
  );
};

export default ListingQueue;
