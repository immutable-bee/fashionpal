import { useState } from "react";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white flex justify-between p-2">
      <div className="pt-2">
        {isMenuOpen ? (
          <img src="/images/x-cross.svg" />
        ) : (
          <img src="/images/hamburger-menu.svg" />
        )}
      </div>

      <div>
        <img width={250} height={250} src="/images/logo.png" />
      </div>

      <div className="pt-2">
        <img src="/images/person.svg" />
      </div>
    </div>
  );
};

const main = () => {
  return <HomeHeader />;
};

export default main;
