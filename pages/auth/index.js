import { useSession } from "next-auth/react";
import { Loading } from "@nextui-org/react";
import AuthContainer from "../../components/containers/AuthContainer";
import SignIn from "../../components/SignIn";

const SignInPage = () => {
  const { data: session, status } = useSession();

  if (status == "loading")
    return (
      <AuthContainer
        id="login-loader"
        content={
          <div className="flex justify-center">
            <Loading size={"lg"} />{" "}
          </div>
        }
      />
    );

  return <SignIn />;
};

export default SignInPage;
