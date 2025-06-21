import { Package, PackageOpen, Truck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LowStockAlert from "../components/Dashboard/LowStockAlert";
import LowStockMaterialsTable from "../components/Dashboard/LowStockMaterialsTable";
import RecentUsageTable from "../components/Dashboard/RecentUsageTable";
import StatCard from "../components/Dashboard/StatCard";
import { ADMIN, EMPLOYEE } from "../constants/constants";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardInfroForAmdin,
  getDashboardInfroForEmpoloyee,
} from "../services/dashboardService";
import { DashboardInfo } from "../types";

const Dashboard: React.FC = () => {
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo>();
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchDataForAdmin = async () => {
    try {
      const response = await getDashboardInfroForAmdin();
      setDashboardInfo(response);
    } catch (error) {
      toast.error("Не вдалося отримати дані для інформаційної панелі");
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataForEmployee = async () => {
    try {
      const response = await getDashboardInfroForEmpoloyee(user?.id);
      setDashboardInfo(response);
    } catch (error) {
      toast.error("Не вдалося отримати дані для інформаційної панелі");
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === ADMIN) {
      fetchDataForAdmin();
    } else if (user?.role === EMPLOYEE) {
      fetchDataForEmployee();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user?.role === EMPLOYEE && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            <StatCard
              title="Види матеріалів"
              value={String(dashboardInfo?.totalMaterials)}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Матеріалів на складі"
              value={String(dashboardInfo?.totalAmountInStock)}
              icon={PackageOpen}
              color="green"
            />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
            <RecentUsageTable usageData={dashboardInfo?.recentUsages ?? []} />
          </div>
        </div>
      )}

      {user?.role === ADMIN && (
        <div className="space-y-6">
          <LowStockAlert materials={dashboardInfo?.lowStockMaterials ?? []} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Види матеріалів"
              value={String(dashboardInfo?.totalMaterials)}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Матеріалів на складі"
              value={String(dashboardInfo?.totalAmountInStock)}
              icon={PackageOpen}
              color="green"
            />

            <StatCard
              title="Постачальники"
              value={String(dashboardInfo?.totalSuppliers)}
              icon={Truck}
              color="purple"
            />
            <StatCard
              title="Співробітники"
              value={String(dashboardInfo?.totalEmployees)}
              icon={Users}
              color="red"
            />
          </div>
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            <RecentUsageTable usageData={dashboardInfo?.recentUsages ?? []} />

            <LowStockMaterialsTable
              lowStockMaterials={dashboardInfo?.lowStockMaterials ?? []}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
