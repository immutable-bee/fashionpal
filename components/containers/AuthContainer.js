import Image from "next/image";
import PeopleSVG from '../../assets/svg/people.svg'
import Logo from '../../public/logo.png'
const AuthContainer = (props) => {
  return (
    <div className="sm:flex min-h-screen bg-[#FEFBE8] onboarding-page-container">

      <div className="sm:w-1/2 hidden sm:flex items-center justify-center" id="people-svg-container">
        <Image
          id="people-svg"
          src={PeopleSVG}
          alt="People Networking"
          width={500}
          height={450}
        />
      </div>
      <div className="sm:w-1/2 flex items-center justify-center" id="auth-rect-container">
        <div className="bg-white sm:pt-12 sm:pb-3 sm:border rounded-3xl sm:border-gray-700 min-h-screen sm:min-h-[auto] sm:block flex items-center sm:max-w-lg w-full mx-auto px-4 sm:px-12">
          <div className="w-full">
            <div id="logo-container" className="flex justify-center mb-4">
              <Image src={Logo} alt="Logo" className="!w-32" />
            </div>
            {props.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
