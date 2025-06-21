import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import MainCaption from "../components/Common/MainCaption/MainCaption";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-500 flex flex-col justify-center gap-3 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <MainCaption />
      </div>
      <div className=" sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white pt-2 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-xl my-4 font-extrabold text-gray-900">
            Увійдіть в свій акаунт
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
