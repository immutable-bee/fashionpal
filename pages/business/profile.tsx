"use client";

import ProfileComponent from "@/components/scoped/ProfileComponent";
import Head from "next/head";

export default function Home() {
  return (
    <>
      {" "}
      <Head>
        <title>Profile</title>
      </Head>
      <ProfileComponent />
    </>
  );
}
