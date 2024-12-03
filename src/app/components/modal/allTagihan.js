import React, { useState, useEffect } from "react";
import axios from "axios";
import GenerateTagihanModal from "./generatetagihanmodal";
import { API_URL } from "@/app/common/api";

const ModalAllData = ({ closeModal, showGenerateExcelModal, alamatRumah }) => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    bulanTagihan: "",
    tahunTagihan: "",
    search: "",
  });
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataRT, setDataRT] = useState([]);
  const [selectedDataRT, setSelectedDataRT] = useState("");

  // Ambil semua data
  useEffect(() => {
    const fetchRT = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/pelangganRTRW`);
        const data = await response.json();
        setDataRT(data.data.sort((a, b) => a._id.localeCompare(b._id)));
        console.log(dataRT);
      } catch (err) {
        setError(`Error fetching RW data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRT();
  }, []);

  const fetchTagihanByRT = async (rw) => {
    console.log(rw);
    setSelectedDataRT(rw);
    console.log(`Sedang memuat tagihan all dari ${rw}`);
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tagihan?alamatRumah=${rw}`);
      const data = response.data.data;

      if (Array.isArray(data)) {
        setAllData(data);
        setFilteredData(data); // Set filtered data awal
      } else {
        console.error("Data tagihan bukan array:", data);
        setAllData([]);
        setFilteredData([]);
      }
      console.log(`Tagihan dari ${rw} telah dimuat`);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter berdasarkan bulan, tahun, dan pencarian
  useEffect(() => {
    let newFilteredData = allData;

    if (filters.bulanTagihan) {
      newFilteredData = newFilteredData.filter(
        (item) => item.bulanTagihan === filters.bulanTagihan
      );
    }

    if (filters.tahunTagihan) {
      newFilteredData = newFilteredData.filter(
        (item) => item.tahunTagihan === filters.tahunTagihan
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      newFilteredData = newFilteredData.filter(
        (item) =>
          item.idTagihan.toLowerCase().includes(search) ||
          item.idMeteran.toLowerCase().includes(search)
      );
    }

    setFilteredData(newFilteredData);
  }, [filters, allData]);

  // Fungsi untuk menangani perubahan filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Fungsi untuk filter data berdasarkan bulan, tahun, dan pencarian
  useEffect(() => {
    let newFilteredData = allData;

    if (filters.bulanTagihan) {
      newFilteredData = newFilteredData.filter(
        (item) => item.bulanTagihan === filters.bulanTagihan
      );
    }

    if (filters.tahunTagihan) {
      newFilteredData = newFilteredData.filter(
        (item) => item.tahunTagihan === filters.tahunTagihan
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      newFilteredData = newFilteredData.filter(
        (item) =>
          item.idTagihan.toLowerCase().includes(search) ||
          item.idMeteran.toLowerCase().includes(search)
      );
    }

    setFilteredData(newFilteredData);
  }, [filters, allData]);

  // Fungsi untuk mengubah jumlah data per halaman
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset ke halaman pertama
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk mengubah halaman
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container  mx-auto px-4 py-6 bg-white shadow-lg">
      {/* RT/RW Selection */}
      <div className="overflow-x-auto mb-5">
        <div className="flex flex-wrap md:flex-nowrap overflow-auto gap-2 mb-5">
          {dataRT &&
            dataRT.map((rw) => {
              const match = rw._id.match(/RT (\d+) RW (\d+)/);
              const rtRwText = match
                ? `RT ${match[1]} / RW ${match[2]}`
                : rw._id;

              return (
                <button
                  key={rw._id}
                  onClick={() => fetchTagihanByRT(rw._id)}
                  className={`px-3 py-2 rounded-lg shadow flex-shrink-0 flex-grow
                  ${rw === rw.id ? "bg-blue-500 text-white" : "bg-gray-200"} 
                  hover:bg-blue-400 text-xs sm:text-sm`}
                >
                  {rtRwText}
                </button>
              );
            })}
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
        Data Riwayat Tagihan
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 text-xs sm:text-sm font-medium">
            Bulan Tagihan
          </label>
          <select
            name="bulanTagihan"
            value={filters.bulanTagihan}
            onChange={handleFilterChange}
            className="py-2 px-3 border border-gray-300 rounded text-xs sm:text-sm"
          >
            <option value="">--Pilih Bulan--</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 text-xs sm:text-sm font-medium">
            Tahun Tagihan
          </label>
          <select
            name="tahunTagihan"
            value={filters.tahunTagihan}
            onChange={handleFilterChange}
            className="py-2 px-3 border border-gray-300 rounded text-xs sm:text-sm"
          >
            <option value="">Pilih Tahun</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="mb-2 text-xs sm:text-sm font-medium">
            Pencarian
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="ID Tagihan / ID Meteran"
            className="py-2 px-3 border border-gray-300 rounded text-xs sm:text-sm"
          />
        </div>
        <div className="flex flex-col justify-end">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="py-2 px-3 border border-gray-300 rounded text-xs sm:text-sm"
          >
            <option value={10}>10 per halaman</option>
            <option value={25}>25 per halaman</option>
            <option value={50}>50 per halaman</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto w-full rounded-2xl ">
        <table className="table-auto text-xs sm:text-sm">
          <thead className="bg-amber-800 text-white">
            <tr>
              {[
                "ID Meteran",
                "Nama Pelanggan",
                "Bulan",
                "Tahun",
                "Meteran Sebelumnya",
                "Meteran Sekarang",
                "Total Tagihan",
                "Status Pembayaran",
                "Tanggal Bayar",
                "Metode Bayar",
              ].map((header) => (
                <th key={header} className="px-4 py-3 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-amber-100 border-b border-gray-200"
              >
                {[
                  item.idMeteran,
                  item.namaKepalaRumah,
                  item.bulanTagihan,
                  item.tahunTagihan,
                  item.meteranSebelumnya,
                  item.meteranSekarang,
                  item.totalTagihan,
                  item.statusPembayaran,
                  item.tanggalBayar,
                  item.metodeBayar,
                ].map((value, index) => (
                  <td key={index} className="px-4 py-3 text-center">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGenerateExcelModal && (
        <GenerateTagihanModal
          closeModal={closeModal}
          alamatRumah={selectedDataRT}
        />
      )}

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginatedData.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 border rounded-lg shadow-md space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-bold text-xs">ID Tagihan:</span>
              <span className="text-xs">{item.idTagihan}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-xs">Total Tagihan:</span>
              <span className="text-xs">{item.totalTagihan}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-xs">Status:</span>
              <span className="text-xs">{item.statusPembayaran}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-10">
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <span>
            Menampilkan {startIndex + 1} - {startIndex + paginatedData.length}
            dari {filteredData.length} entri
          </span>
        </div>
        <div className="flex items-center space-x-2 ">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 
                       text-xs sm:text-sm bg-white hover:bg-gray-100"
          >
            Sebelumnya
          </button>
          <span className="px-3 py-2 bg-amber-900 text-white rounded-lg text-xs sm:text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 
                       text-xs sm:text-sm bg-white hover:bg-gray-100"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAllData;
