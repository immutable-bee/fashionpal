import { useState } from "react";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white flex justify-between p-2">
      <div className="pt-2">
        {isMenuOpen ? (
          <img
            onClick={() => setIsMenuOpen(false)}
            src="/images/x-cross.svg"
            width={40}
            height={40}
          />
        ) : (
          <img
            onClick={() => setIsMenuOpen(true)}
            src="/images/hamburger-menu.svg"
            width={40}
            height={40}
          />
        )}
      </div>

      <div>
        <img width={250} height={250} src="/images/logo.png" />
      </div>

      <div className="pt-5">
        <img src="/images/person.svg" width={40} height={40} />
      </div>
    </div>
  );
};

const main = () => {
  return <HomeHeader />;
};

export default main;
