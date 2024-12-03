import React from "react";
const Pagination = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded ${
          currentPage === 1 ? "bg-gray-200" : "bg-amber-900 text-white"
        }`}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded ${
          currentPage === totalPages ? "bg-gray-200" : "bg-amber-900 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
