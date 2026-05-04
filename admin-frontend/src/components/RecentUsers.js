import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

export default function RecentUsers({ users }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">

      {/* HEADER */}
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Recent Users
      </h2>

      {/* LIST */}
      <div className="space-y-2">

        {users?.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/users/${user._id}`)}
            className="flex items-center justify-between p-4 rounded-xl 
            border border-gray-100
            hover:bg-[#f4fbf8] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          >

            {/* LEFT */}
            <div>

              {/* NAME */}
              <p className="font-semibold text-gray-900 text-base">
                {user.name}
              </p>

              {/* EMAIL */}
              <p className="text-sm text-gray-600">
                {user.email}
              </p>

              {/* STATUS + SCANS */}
              <div className="flex items-center gap-3 mt-2">

                {/* STATUS BADGE */}
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Active
                </span>

                {/* SCANS */}
                <span className="text-sm font-medium text-gray-700">
                  {user.totalScans || 0} scans
                </span>

              </div>
            </div>

            {/* RIGHT ICON */}
            <div className="text-gray-500 text-lg">
              <FaChevronRight />
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}