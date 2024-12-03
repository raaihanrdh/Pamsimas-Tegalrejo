"use client";
import React, { useState } from "react";
import Navbar from "../components/Nav/navbar";
import Toast from "../components/Toast/successToast";
import { API_URL } from "../common/api";
const ROOT_API = process.env.NEXT_PUBLIC_API;
const API_V = process.env.NEXT_PUBLIC_API_V;

const Page = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [filteredPengaduan, setFilteredPengaduan] = useState([]);
  const [idPengaduanSearch, setIdPengaduanSearch] = useState(""); // Untuk ID Pengaduan
  const [idMeteranSearch, setIdMeteranSearch] = useState(""); // Untuk ID Meteran
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSearchByPengaduan = async () => {
    if (!idPengaduanSearch) {
      setToastType("error");
      setResponseMessage("Silakan masukkan ID Pengaduan atau ID Meteran");
      setShowToast(true);
      return;
    }

    try {
      let response;
      response = await fetch(
        `${API_URL}/pengaduan/${idPengaduanSearch}/detail`
      );

      const data = await response.json();
      console.log(data);

      if (
        data.data &&
        (Array.isArray(data.data) ? data.data.length > 0 : data.data)
      ) {
        const fetchedData = Array.isArray(data.data) ? data.data : [data.data]; // Handle data tunggal & array
        const sortedData = fetchedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPengaduan(sortedData);
        setFilteredPengaduan(sortedData);
        setCurrentPage(1);
      } else {
        setToastType("error");
        setResponseMessage("Tidak ada pengaduan ditemukan untuk ID tersebut");
        setShowToast(true);
        setPengaduan([]);
        setFilteredPengaduan([]);
      }
    } catch (error) {
      setToastType("error");
      setResponseMessage("Terjadi kesalahan saat mencari pengaduan");
      setShowToast(true);
    }
  };

  const handleSearchById = async () => {
    if (!idMeteranSearch) {
      setToastType("error");
      setResponseMessage("Silakan masukkan ID Pengaduan atau ID Meteran");
      setShowToast(true);
      return;
    }

    try {
      let response;
      // Jika input adalah ID Meteran
      response = await fetch(`${API_URL}/pengaduan/${idMeteranSearch}`);

      const data = await response.json();
      console.log(data);

      if (
        data.data &&
        (Array.isArray(data.data) ? data.data.length > 0 : data.data)
      ) {
        const fetchedData = Array.isArray(data.data) ? data.data : [data.data]; // Handle data tunggal & array
        const sortedData = fetchedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPengaduan(sortedData);
        setFilteredPengaduan(sortedData);
        setCurrentPage(1);
      } else {
        setToastType("error");
        setResponseMessage("Tidak ada pengaduan ditemukan untuk ID tersebut");
        setShowToast(true);
        setPengaduan([]);
        setFilteredPengaduan([]);
      }
    } catch (error) {
      setToastType("error");
      setResponseMessage("Terjadi kesalahan saat mencari pengaduan");
      setShowToast(true);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPengaduan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPengaduan.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-amber-900 to-amber-800 px-6 py-8">
      <h2 className="text-3xl font-semibold mb-8">
        Halaman Pengaduan Pelanggan
      </h2>

      {/* Pencarian Pengaduan */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Cari Pengaduan</h3>
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Kolom Kiri: Input ID Pengaduan */}
          <div className="flex flex-col sm:w-1/2 space-y-2">
            <label htmlFor="idPengaduan" className="text-sm font-medium">
              ID Pengaduan
            </label>
            <div className="flex w-full">
              <input
                id="idPengaduan"
                type="text"
                placeholder="Masukkan ID Pengaduan"
                className="w-full p-3 border border-gray-300 rounded-l-lg text-gray-700"
                value={idPengaduanSearch}
                onChange={(e) => setIdPengaduanSearch(e.target.value)}
              />
              <button
                onClick={handleSearchByPengaduan}
                className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-r-lg"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Input ID Meteran */}
          <div className="flex flex-col sm:w-1/2 space-y-2">
            <label htmlFor="idMeteran" className="text-sm font-medium">
              ID Meteran
            </label>
            <div className="flex w-full">
              <input
                id="idMeteran"
                type="text"
                placeholder="Masukkan ID Meteran"
                className="w-full p-3 border border-gray-300 rounded-l-lg text-gray-700"
                value={idMeteranSearch}
                onChange={(e) => setIdMeteranSearch(e.target.value)}
              />
              <button
                onClick={handleSearchById}
                className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-r-lg"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Pengaduan */}
      {filteredPengaduan.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Daftar Pengaduan</h3>

          <div className="flex justify-end mb-4">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="py-2 px-4 border border-gray-300 rounded text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="hidden md:block overflow-x-auto shadow-2xl rounded-2xl">
            <table className="min-w-full table-auto border-separate border-spacing-0 rounded-lg shadow-xl">
              <thead className="bg-amber-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                    ID Pengaduan
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                    ID Meteran
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                    Pesan
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item.idPengaduan}
                    className={`transition duration-300 ease-in-out hover:bg-amber-100 ${
                      index % 2 === 0 ? "bg-amber-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                      {item.idPengaduan}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                      {item.idMeteran}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                      {item.pesan}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-full whitespace-nowrap text-white ${
                          item.statusAduan === "Selesai"
                            ? "bg-green-500"
                            : item.statusAduan === "Diproses"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item.statusAduan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="grid grid-cols-1 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.idPengaduan}
                  className="bg-white shadow-lg rounded-lg p-6"
                >
                  <h4 className="font-semibold">
                    ID Pengaduan: {item.idPengaduan}
                  </h4>
                  <p className="text-sm">ID Meteran: {item.idMeteran}</p>
                  <p className="text-sm">Pesan: {item.pesan}</p>
                  <span
                    className={`px-3 py-1 rounded-full whitespace-nowrap text-white ${
                      item.statusAduan === "Selesai"
                        ? "bg-green-500"
                        : item.statusAduan === "Diproses"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.statusAduan}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-4 rounded-lg"
            >
              Prev
            </button>
            <span className="flex items-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-4 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {showToast && (
        <Toast
          type={toastType}
          message={responseMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Page;
