"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Nav/navbar";
import Toast from "../components/Toast/successToast";
import { API_URL } from "../common/api";
import { withAuth, getAuth } from "../utils/routerAuth";
import { FiTrash2 } from "react-icons/fi";

const PengaduanPage = () => {
  const [pengaduan, setPengaduan] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    idMeteran: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [filteredPengaduan, setFilteredPengaduan] = useState([]);
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page

  const [user, setUser] = useState({
    permissions: {
      pelanggan: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      tagihan: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      pengaduan: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
      ambang: {
        create: 0,
        read: 0,
        update: 0,
        delete: 0,
      },
    },
    _id: "",
    idAkun: "",
    nama: "",
    password: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
    username: "",
  });

  useEffect(() => {
    const authUser = getAuth();
    setUser(authUser);
  }, []);

  useEffect(() => {
    const fetchPengaduan = async () => {
      const response = await fetch(`${API_URL}/pengaduan`);
      const data = await response.json();
      const sortedData = data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPengaduan(sortedData);
      setFilteredPengaduan(sortedData);
    };
    fetchPengaduan();
  }, []);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPengaduan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  // Handle page change
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to page 1 whenever items per page change
  };

  const totalPages = Math.ceil(filteredPengaduan.length / itemsPerPage);

  const validateForm = () => {
    const newErrors = {};
    if (!newComplaint.idMeteran) {
      newErrors.idMeteran = "ID Meteran wajib diisi.";
    } else if (!/^PAM-\d{4}$/.test(newComplaint.idMeteran)) {
      newErrors.idMeteran = "ID Meteran harus dalam format PAM-XXXX.";
    }

    if (!newComplaint.pesan) {
      newErrors.pesan = "Pesan Pengaduan wajib diisi.";
    } else if (newComplaint.pesan.length < 10) {
      newErrors.pesan = "Pesan Pengaduan harus memiliki minimal 10 karakter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/pengaduan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComplaint),
      });

      const result = await response.json();

      if (response.status === 200) {
        setPengaduan((prev) => [...prev, result.data]);
        setNewComplaint({ idMeteran: "", pesan: "" });
        setToastType("success");
        setResponseMessage("Pengaduan berhasil dikirim!");
      } else {
        setToastType("error");
        setResponseMessage(result.message || "Gagal mengirim pengaduan.");
      }
    } catch (error) {
      setToastType("error");
      setResponseMessage("Terjadi kesalahan saat mengirim pengaduan.");
    } finally {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredPengaduan(
      pengaduan.filter((item) => item.pesan.toLowerCase().includes(query))
    );
  };

  const handleStatusFilter = (e) => {
    const statusFilter = e.target.value;
    setFilteredPengaduan(
      pengaduan.filter((item) =>
        statusFilter ? item.statusAduan === statusFilter : true
      )
    );
  };

  const handleStatusChange = async (idPengaduan, newStatus) => {
    const validStatuses = ["Belum diproses", "Diproses", "Selesai"];
    if (!validStatuses.includes(newStatus)) {
      alert("Status yang dipilih tidak valid.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/pengaduan/${idPengaduan}/detail`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statusAduan: newStatus }),
        }
      );

      const result = await response.json();
      if (response.status === 200) {
        setPengaduan((prevPengaduan) =>
          prevPengaduan.map((item) =>
            item.idPengaduan === idPengaduan
              ? { ...item, statusAduan: newStatus }
              : item
          )
        );
        setFilteredPengaduan((prevFiltered) =>
          prevFiltered.map((item) =>
            item.idPengaduan === idPengaduan
              ? { ...item, statusAduan: newStatus }
              : item
          )
        );
      } else {
        alert(result.message || "Gagal memperbarui status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat memperbarui status.");
    }
  };

  const handleDeletePengaduan = async (idPengaduan) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pengaduan/${idPengaduan}`, {
        method: "DELETE",
      });

      if (!response.status === 200) {
        setToastType("error");
        setResponseMessage(response.message || "Gagal mengirim pengaduan.");
      } else {
        setToastType("success");
        setResponseMessage("Pengaduan berhasil dihapus!");
      }
    } catch (err) {
      setErrors(err);
      setToastType("error");
      setResponseMessage(err || "Gagal mengirim pengaduan.");
    } finally {
      setLoading(false);
      setShowToast(true);
      setToastType("success");
      setResponseMessage("Pengaduan berhasil dihapus!");
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 px-6 py-8">
      <h2 className="text-3xl font-semibold mb-8">Halaman Pengaduan</h2>

      {/* Form Pengaduan Baru */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Ajukan Pengaduan Baru</h3>
        <form onSubmit={handleAddComplaint}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">ID Meteran</label>
              <input
                type="text"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.idMeteran
                    ? "border-red-500 focus:ring-red-300"
                    : "focus:ring-amber-300"
                }`}
                value={newComplaint.idMeteran}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    idMeteran: e.target.value,
                  })
                }
                required
              />
              {errors.idMeteran && (
                <p className="text-red-500 text-sm mt-1">{errors.idMeteran}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Pesan Pengaduan</label>
              <textarea
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  errors.pesan
                    ? "border-red-500 focus:ring-red-300"
                    : "focus:ring-amber-300"
                }`}
                rows="4"
                value={newComplaint.pesan}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    pesan: e.target.value,
                  })
                }
                required
              />
              {errors.pesan && (
                <p className="text-red-500 text-sm mt-1">{errors.pesan}</p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg mt-4 text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-800 hover:bg-amber-900"
              }`}
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Ajukan Pengaduan"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Pengaduan */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Daftar Pengaduan</h3>

        {/* Filter Pengaduan */}
        <div className="flex items-center justify-between mb-4 flex-col sm:flex-row">
          <div className="flex space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Pengaduan"
              className="p-3 border border-gray-300 rounded-lg w-full"
              onChange={handleSearch}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto"
              onChange={handleStatusFilter}
            >
              <option value="">Filter Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Diproses">Diproses</option>
              <option value="Belum diproses">Belum diproses</option>
            </select>
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
        </div>

        {/* Daftar Pengaduan dengan Pagination */}
        <div className="hidden sm:block overflow-x-auto shadow-2xl rounded-2xl">
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
                {(user.permissions.pengaduan.update === 1 ||
                  user.permissions.pengaduan.delete === 1) && (
                  <th className="px-6 py-4 text-center border-b border-gray-300 text-sm font-medium">
                    Aksi
                  </th>
                )}
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
                  {(user.permissions.pengaduan.update === 1 ||
                    user.permissions.pengaduan.delete === 1) && (
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      <div className="relative">
                        {user.permissions.pengaduan.update === 1 && (
                          <select
                            className="bg-white border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-900 transition duration-200 ease-in-out"
                            onChange={(e) =>
                              handleStatusChange(
                                item.idPengaduan,
                                e.target.value
                              )
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Ubah Status
                            </option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                          </select>
                        )}
                        <br />
                        {user.permissions.pengaduan.delete === 1 && (
                          <button
                            onClick={() =>
                              handleDeletePengaduan(item.idPengaduan)
                            }
                            className="btn-sm bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                          >
                            <FiTrash2 className="text-white" /> Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block sm:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item.idPengaduan}
                className="bg-white shadow-lg rounded-lg p-6"
              >
                <h4 className="font-semibold">
                  ID Pengaduan: {item.idPengaduan}
                </h4>
                <p className="text-sm">ID Meteran: {item.idMeteran}</p>
                <p className="text-sm mb-4">Pesan: {item.pesan}</p>
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full inline-block text-white ${
                      item.statusAduan === "Selesai"
                        ? "bg-green-500"
                        : item.statusAduan === "Diproses"
                        ? "bg-yellow-500"
                        : "bg-red-500 "
                    }`}
                  >
                    {item.statusAduan}
                  </span>
                </div>
                <div className="flex justify-center mt-5 space-x-2">
                  <button
                    onClick={() =>
                      handleStatusChange(item.idPengaduan, "Diproses")
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Proses
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(item.idPengaduan, "Selesai")
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex justify-center items-center  gap-2 mx-auto">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-600">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, currentItems.length)} of{" "}
          {currentItems.length} entries
        </div>
      </div>
      {showToast && (
        <Toast
          type={toastType}
          message={responseMessage}
          isOpen={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default withAuth(PengaduanPage);
