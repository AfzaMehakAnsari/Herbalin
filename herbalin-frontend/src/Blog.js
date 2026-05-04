import React, { useEffect, useState } from "react";

const BlogGrid = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  //FETCH API
// useEffect(() => {
 //  fetch("/api/Tips")
   //  .then((res) => res.json())
 //    .then((data) => setArticles(Array.isArray(data) ? data : []))
   // .catch((err) => console.error("API Error:", err));
  //}, []);

  // Pagination logic
  const totalPages = Math.ceil(articles.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = articles.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B5E44] text-center mb-8">
          Insights into Natural Healing & Herbal Remedies
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[800px]">
          {currentCards.map((item, index) => (
            <div
              key={index}
              className="bg-[#F8F9FB] rounded-[45px] overflow-hidden shadow-sm flex flex-col border border-gray-50"
            >
              <div className="p-4">
                <div className="h-64 w-full overflow-hidden rounded-[35px]">
                  <img
                    src={item.imageUrl}
                    alt={item.tipTitle}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              <div className="px-10 pb-10 pt-2 flex flex-col flex-grow">
                {/* Title */}
                <h2 className="text-[#1E212D] text-[22px] font-bold leading-tight mb-4">
                  {item.tipTitle}
                </h2>
                {/* Tip Text */}
                <p className="text-[#1B5E44] text-base font-medium mb-2">
                  {item.tipText}
                </p>
                {/* Description */}
                <p className="text-gray-500 text-[15px] leading-relaxed mb-10 flex-grow">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="flex justify-end items-center pt-5 border-t border-gray-100">
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1B5E44] font-bold text-sm flex items-center gap-2 group"
                  >
                    Read more
                    <span className="text-xl text-[#1B5E44] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-16">
          <div className="flex items-center gap-4 bg-white px-8 py-3 rounded-full shadow-sm border border-gray-50">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-[#1B5E44] text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;