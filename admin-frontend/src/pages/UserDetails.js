import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getUsers, getScans } from "../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const users = await getUsers();
    const scansData = await getScans();

    const foundUser = users.find((u) => u._id === id);
    const userScans = scansData.filter(
      (s) => s.userId?._id === id
    );

    setUser(foundUser);
    setScans(userScans);
  };

  if (!user) return <p className="ml-64 p-10">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full p-8 bg-gray-50 min-h-screen">

        {/* BACK */}
        {/* BACK */}
        <Link
  to="/users"
  className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
>
  <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

  <span>
    Back to User
  </span>
</Link>

        {/* USER INFO */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>

          <hr className="my-6" />

          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-gray-500 text-sm">Total Scans</p>
              <h2 className="text-2xl font-bold">{scans.length}</h2>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Join Date</p>
              <h2 className="text-xl font-bold">
                {new Date(user.createdAt).toLocaleDateString()}
              </h2>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <h2 className="text-xl font-bold text-[#1B5E44]">
                Active
              </h2>
            </div>
          </div>
        </div>

        {/* SCAN HISTORY (UPDATED UI + CLICKABLE) */}
<div className="grid grid-cols-3 gap-6">
  {scans.map((scan) => (
    <div
      key={scan._id}
      onClick={() => navigate(`/scans/${scan._id}`)}
      className="bg-white rounded-2xl shadow p-4 cursor-pointer 
      hover:shadow-xl hover:scale-[1.03] transition duration-300"
    >
      <img
        src={scan.image}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />

      <h3 className="font-bold text-lg text-[#1B5E44]">
        {scan.disease}
      </h3>

      <p className="text-sm text-gray-500">
        {scan.severity}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {new Date(scan.createdAt).toLocaleDateString()}
      </p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}