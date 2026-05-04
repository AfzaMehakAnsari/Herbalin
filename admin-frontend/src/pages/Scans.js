import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { getScans } from "../services/api";

export default function Scans() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [scans, setScans] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getScans();
        setScans(res || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // FILTER + SEARCH
  let filtered = scans.filter((scan) => {
    const category = scan.disease?.toLowerCase() || "normal";

    const matchesFilter = filter === "all" || category === filter;

    const matchesSearch =
      scan.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      scan.disease?.toLowerCase().includes(search.toLowerCase()) ||
      scan.result?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // SORT
  filtered.sort((a, b) => {
    return sort === "latest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const currentScans = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 w-full p-6 bg-gray-50 min-h-screen">

        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
        >
          <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

          <span>
            Back to Dashboard
          </span>
        </Link>

        {/* TITLE */}
        <h1 className="text-3xl font-bold">Scans</h1>
        <p className="text-gray-500 mb-6">
          View and manage all skin scans
        </p>

        {/* SEARCH + FILTER + SORT */}
        <div className="flex justify-between items-center mb-6 gap-4">

          {/* SEARCH */}
          <div className="flex items-center bg-white p-3 rounded-xl shadow w-full transition hover:shadow-md">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by user, disease..."
              className="w-full outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* FILTER */}
          <div className="flex gap-2">
            {["all", "acne", "eczema", "normal"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition duration-200 hover:scale-105 ${filter === f
                    ? "bg-[#1B5E44] text-white shadow-md"
                    : "bg-white text-gray-600 shadow hover:bg-gray-100"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* SORT */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none px-5 py-2 pr-10 rounded-xl bg-white shadow text-gray-700 focus:outline-none transition hover:shadow-md"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>

            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
              ▼
            </span>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-6">
          {currentScans.map((scan) => (
            <div
              key={scan._id}
              className="bg-white p-5 rounded-2xl shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* ICON */}
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-xl mb-4 transition hover:bg-[#1B5E44]/10">
                <FaSearch className="text-[#1B5E44]" />
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold">
                {scan.disease} Scan
              </h2>

              <p className="text-gray-600">
                {scan.userId?.name || "Unknown User"}
              </p>

              {/* RESULT */}
              <div className="bg-gray-100 p-3 rounded-lg mt-3 flex justify-between items-center transition hover:bg-gray-200">
                <span>
                  Result: {scan.severity} {scan.disease}
                </span>

                <button
                  key={scan._id}
                  onClick={() => navigate(`/scans/${scan._id}`)}
                  className="transition hover:scale-110"
                >
                  <FaArrowRight className="text-gray-500 hover:text-[#1B5E44]" />
                </button>
              </div>

              <hr className="my-3" />

              <p className="text-sm text-gray-400">
                {new Date(scan.createdAt).toDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-xl transition hover:scale-105 ${currentPage === i + 1
                  ? "bg-[#1B5E44] text-white"
                  : "bg-white shadow hover:bg-gray-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}