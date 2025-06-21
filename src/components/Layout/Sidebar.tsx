import {
  BarChart,
  ClipboardList,
  Gem,
  Home,
  Package,
  Send,
  Truck,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { isAdmin } = useAuth();

  return (
    <div
      className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-20 transform transition duration-200 ease-in-out
      ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex items-center space-x-2 px-4">
        <Gem className="h-8 w-8" />
        <span className="text-2xl font-extrabold">Sapphire</span>
      </div>

      <nav className="mt-10">
        <SidebarLink to="/" icon={<Home />} text="Інформаційна панель" />
        <SidebarLink to="/materials" icon={<Package />} text="Матеріали" />
        <SidebarLink
          to="/usage-log"
          icon={<ClipboardList />}
          text="Історія використання"
        />

        {isAdmin && (
          <>
            <SidebarLink
              to="/suppliers"
              icon={<Truck />}
              text="Постачальники"
            />
            <SidebarLink
              to="/supplies"
              icon={<Send />}
              text="Поставки матеріалів"
            />
            <SidebarLink
              to="/employees"
              icon={<Users />}
              text="Співробітники"
            />
            <SidebarLink to="/reports" icon={<BarChart />} text="Звіт" />
          </>
        )}
      </nav>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center py-2.5 px-4 rounded transition duration-200 ${
        isActive ? "bg-blue-700 border-l-2 border-gray-50" : "hover:bg-blue-700"
      }`
    }
  >
    <div className="h-5 w-5 mr-3">{icon}</div>
    {text}
  </NavLink>
);

export default Sidebar;
