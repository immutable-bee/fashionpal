import { useState, useEffect } from "react";
import HeaderComponent from "@/components/utility/Header";
import ButtonComponent from "@/components/utility/Button";
import { signOut } from "next-auth/react";
import { QRCode } from "react-qrcode-logo";

import ConsumerInfo from "@/components/consumer/profile/ConsumerInfo";
import ThriftList from "@/components/consumer/profile/Thrifts";

const ProfileComponent = ({}) => {
  const [displatThrift, setDisplayThrift] = useState(false);
  const [consumerData, setConsumerData] = useState({});
  const toggleThriftList = () => {
    setDisplayThrift(!displatThrift);
  };
  const fetchConsumerDetails = async () => {
    const response = await fetch("/api/consumer/profile/");

    if (!response.ok) {
      console.error("Failed to get queue");
    } else {
      const data = await response.json();
      setConsumerData(data);
    }
  };
  useEffect(() => {
    fetchConsumerDetails();
  }, []);

  return (
    <div className='min-h-screen bg-white '>
      <HeaderComponent />
      <div className='h-full flex flex-col items-center justify-center'>
        {displatThrift ? (
          <ThriftList
            toggleThrift={toggleThriftList}
            consumerData={consumerData}
            setConsumerData={setConsumerData}
          />
        ) : (
          <ConsumerInfo
            consumerData={consumerData}
            setConsumerData={setConsumerData}
          />
        )}
        {!displatThrift && (
          <div className='mt-4 w-full max-w-lg'>
            <ButtonComponent
              className='my-7'
              rounded
              full
              onClick={() => toggleThriftList()}
            >
              Thrift List
            </ButtonComponent>
          </div>
        )}
        <div className='mt-4 w-full max-w-lg'>
          <ButtonComponent full rounded onClick={() => signOut()}>
            Sign Out
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
