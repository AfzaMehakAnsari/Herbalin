import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RecentUsers from "../components/RecentUsers";
import { getUsersWithScans } from "../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getUsersWithScans();
      setUsers(data);
    };
    fetch();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full p-6 bg-gray-50 min-h-screen">
        <Link
  to="/"
  className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
>
  <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

  <span>
    Back to Dashboard
  </span>
</Link>
        <h1 className="text-3xl font-bold mb-6">Users</h1>

        <RecentUsers users={users} />
      </div>
    </div>
  );
}