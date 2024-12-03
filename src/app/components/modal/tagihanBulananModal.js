// import TagihanBulanan from "@/app/Tagihan/page";
import React, { useState } from "react";

const TagihanBulananModal = ({
  isOpen,
  onClose,
  dataTagihan = [], // Provide a default empty array to avoid undefined errors
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  itemsPerPage,
  setItemsPerPage,
  currentItems,
  currentPage,
  totalPages,
  paginate,
  handleEditTagihan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-7xl p-6 rounded-lg shadow-lg overflow-y-auto">
        {/* Other code */}

        {/* Card View (Mobile) */}
        <div className="lg:hidden grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {dataTagihan.map((tagihan) => (
            <div
              key={tagihan.idTagihan}
              className="bg-white p-4 border rounded-lg shadow-md"
            >
              <p className="font-bold">ID Tagihan: {tagihan.idTagihan}</p>
              <p>ID Meteran: {tagihan.idMeteran}</p>
              <p>Meteran Sebelumnya: {tagihan.meteranSebelumnya}</p>
              <p>Meteran Sekarang: {tagihan.meteranSekarang}</p>
              <p>Total Tagihan: {tagihan.totalTagihan}</p>
              <p>Status Pembayaran: {tagihan.statusPembayaran}</p>
              <p>Tanggal Bayar: {tagihan.tanggalBayar}</p>
              <p>Metode Bayar: {tagihan.metodeBayar}</p>
              <button
                onClick={() => handleEditTagihan(tagihan)}
                className="bg-amber-900 text-white py-1 px-3 mt-2 rounded"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Other code */}
      </div>
    </div>
  );
};

export default TagihanBulananModal;
