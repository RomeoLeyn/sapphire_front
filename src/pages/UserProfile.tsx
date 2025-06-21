import { useEffect, useState } from "react";
import UserProfileInfo from "../components/UserProfile/UserProfileInfo";
import { useAuth } from "../context/AuthContext";
import { updateEmployee } from "../services/employeeService";
import { getUserById } from "../services/userService";
import { DetailsUserInfo } from "../types";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [userInfo, setUser] = useState<DetailsUserInfo | null>(null);
  const { user } = useAuth();

  const getUserInfo = async () => {
    const response = await getUserById(user?.id);
    setUser(response);
  };

  const handleUpdate = async (
    id: string,
    employee: Pick<
      DetailsUserInfo,
      "fullName" | "email" | "username" | "phoneNumber"
    >
  ) => {
    try {
      const response = await updateEmployee(id, employee);
      toast.success("Дані успішно оновлено");
      return response;
    } catch (error) {
      toast.error("Виникла несподівана помилка");
    }
  };

  useEffect(() => {
    if (user?.id) {
      getUserInfo();
    }
  }, [user?.id]);

  return (
    <div>
      {userInfo ? (
        <UserProfileInfo user={userInfo} onUpdate={handleUpdate} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
