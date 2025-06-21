import { Crown, LogOut, User } from "lucide-react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b-2 border-blue-700">
      <div className="max-w-full mx-auto p-4 ">
        <div className="flex flex-wrap sm:justify-between justify-center gap-3">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Управління салоном краси
            </h1>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Link
                to="/user"
                className="inline-flex flex-row items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-300  hover:bg-gray-300 transition-all"
                title="Переглянути профіль"
              >
                <span className="text-md font-semibold">Профіль</span>
                <span className="text-md font-bold pl-2 border-l-2 border-gray-700">
                  {user?.username}
                </span>
                {user?.role === "ADMIN" ? (
                  <Crown size={24} className="text-yellow-700" />
                ) : (
                  <User size={24} />
                )}
              </Link>

              <button
                onClick={logout}
                className="inline-flex flex-row items-center font-semibold gap-2 px-3 py-2 rounded-lg text-white bg-blue-700 hover:bg-blue-600 transition-all"
                title="Вийти із системи"
              >
                <LogOut size={24} />
                Вийти
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
