"use client";

import { useState, useEffect } from "react";
import { withAuth } from "../utils/routerAuth";
import { getAuth } from "../utils/routerAuth";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import EditModal from "../components/modal/editmodal";
import CreateModal from "../components/modal/createmodal";
import QRModal from "../components/modal/QRModal";
import Toast from "../components/Toast/successToast";
import { inconsolata } from "../components/Fonts/fonts";
import { API_URL } from "../common/api";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];
const DataPelanggan = () => {
  const [dataPelanggan, setDataPelanggan] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [responseMessage, setResponseMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [dataRT, setDataRT] = useState([]);
  const [selectedDataRT, setSelectedDataRT] = useState("");
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
  }, [refreshData]);

  const fetchPelangganByRT = async (rw) => {
    setSelectedDataRT(rw);
    setLoading(true);
    setError(null);
    try {
      //TAMBAHIN
      const response = await fetch(`${API_URL}/pelanggan?alamatRumah=${rw}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.data) {
        setDataPelanggan(data.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [rwFilter, setRwFilter] = useState(""); // State untuk RW
  const [excelData, setExcelData] = useState(null);

  const fetchGenerate = async () => {
    if (selectedDataRT) {
      const response = await fetch(
        `${API_URL}/generatepelanggan?alamatRumah=${selectedDataRT}`
      );
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setExcelData(url);
    } else {
      console.log("Data RT Kosong");
    }
  };

  const handleRwFilter = async (rw) => {
    setRwFilter(rw); // Set filter RW
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ambang`);
      const data = await response.json();
      setDataPelanggan(data.data);
    } catch (err) {
      setError(`Error fetching RW data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSaveEdit = async (updatedData) => {
    setLoading(true);
    setError(null); // Reset error state

    console.log("Updated Data:", updatedData); // Debugging: Menampilkan data yang akan diupdate

    try {
      const response = await fetch(
        `${API_URL}/pelanggan/${updatedData.idMeteran}/detail`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        setToastType("error");
        setResponseMessage("Update Data Gagal.");
      } else {
        setToastType("success");
        setResponseMessage("Update Data Berhasil.");
      }
    } catch (error) {
      setToastType("error");
      setResponseMessage("Terjadi kesalahan, coba lagi.");
    }

    setLoading(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const openQRCodeModal = async (idMeteran) => {
    try {
      const qrCodeResponse = await fetch(
        `${API_URL}/pelanggan/${idMeteran}/generate`
      );
      const data = await qrCodeResponse.json();
      if (qrCodeResponse.ok) {
        setQrCode(data.image);
        setQrModalVisible(true);
      } else {
        throw new Error("Gagal mengambil QR Code");
      }
    } catch (error) {
      setError(`Error fetching QR Code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeQRCodeModal = () => setQrModalVisible(false);
  const handleCreatePelanggan = async (newData) => {
    try {
      const response = await fetch(`${API_URL}/pelanggan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        setToastType("error");
        setResponseMessage("Tambah Pelanggan Gagal");
      } else {
        setToastType("success");
        setResponseMessage("Tambah Pelanggan Berhasil!");
      }
      setRefreshData((prev) => prev + 1);
      closeModal();
    } catch (err) {
      setToastType("error");
      setResponseMessage("tambah Data Gagal!");
    } finally {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // Hide toast after 3 seconds
    }
  };

  const handleDeletePelanggan = async (idMeteran) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pelanggan/${idMeteran}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setToastType("error");
        setResponseMessage("Hapus Data Gagal!");
      } else {
        setToastType("success");
        setResponseMessage("Hapus Data Berhasil!");
      }

      setRefreshData((prev) => prev + 1);
    } catch (err) {
      setError(`Error deleting data: ${err.message}`);
    } finally {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const openModal = (type, data = null) => {
    setModalState({ type, data });
  };
  const closeModal = () => setModalState({ type: null, data: null });
  const filteredData = dataPelanggan.filter((item) => {
    const matchesSearch =
      item.namaKepalaRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.idMeteran.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || item.statusMeteran === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container min-h-screen p-5">
      <h1 className={`${inconsolata.className} text-4xl font-semibold mb-4`}>
        Data Pelanggan PAMSIMAS
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>
            <strong>Error:</strong> {error}
          </span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex flex-wrap md:flex-nowrap overflow-auto gap-2 mb-5">
        {dataRT &&
          dataRT.map((rw) => {
            const match = rw._id.match(/RT (\d+) RW (\d+)/);
            const rtRwText = match ? `RT ${match[1]} / RW ${match[2]}` : rw._id;

            return (
              <button
                key={rw._id}
                onClick={() => fetchPelangganByRT(rw._id)}
                className={`px-3 py-2 rounded-lg shadow flex-grow md:flex-shrink-0 
            ${
              rw === rw.id ? "bg-blue-500 text-white" : "bg-gray-200"
            } hover:bg-blue-400 text-sm`}
              >
                {rtRwText}
              </button>
            );
          })}
      </div>

      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-lg p-5">
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border rounded flex-1"
            />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 border rounded"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border rounded"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {user.permissions.pelanggan.create === 1 && (
              <button
                onClick={() => fetchGenerate()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              >
                <FiEdit className="mr-2" />
                Generate Excel
              </button>
            )}
            {user.permissions.pelanggan.create === 1 && (
              <button
                onClick={() => openModal("create")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              >
                <FiPlus className="mr-2" />
                Tambah Pelanggan
              </button>
            )}
            {excelData && user.permissions.pelanggan.create === 1 && (
              <a href={excelData} download={`pelanggan_${selectedDataRT}.xlsx`}>
                Download Excel
              </a>
            )}
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <div className="hidden md:block">
              {/* Tampilkan tabel pada layar besar */}
              <table className="min-w-full bg-white text-sm text-gray-700">
                <thead className="bg-amber-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">ID Meteran</th>
                    <th className="px-6 py-3 text-left">Nama Kepala Rumah</th>
                    <th className="px-6 py-3 text-left">Alamat Rumah</th>
                    <th className="px-6 py-3 text-left">Jenis Meteran</th>
                    <th className="px-6 py-3 text-left">Status Meteran</th>
                    <th className="px-6 py-3 text-left">QR</th>
                    <th className="px-6 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item) => (
                      <tr
                        key={item.idMeteran}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">{item.idMeteran}</td>
                        <td className="px-6 py-4">{item.namaKepalaRumah}</td>
                        <td className="px-6 py-4">{item.alamatRumah}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              item.jenisMeteran === "Pribadi"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.jenisMeteran}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              item.statusMeteran === "Aktif"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.statusMeteran}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openQRCodeModal(item.idMeteran)} // Pass the idMeteran here
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Lihat QR
                          </button>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          {user.permissions.pelanggan.update === 1 && (
                            <button
                              onClick={() => openModal("edit", item)}
                              className="bg-amber-900 text-white hover:bg-amber-800 py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                            >
                              <FiEdit className="text-white" /> Edit
                            </button>
                          )}

                          {user.permissions.pelanggan.delete === 1 && (
                            <button
                              onClick={() =>
                                handleDeletePelanggan(item.idMeteran)
                              }
                              className="bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
                            >
                              <FiTrash2 className="text-white" /> Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tampilan Kartu untuk layar kecil */}
            <div className="md:hidden">
              {currentData.length === 0 ? (
                <p className="text-center text-gray-400">
                  Tidak ada data yang ditemukan
                </p>
              ) : (
                currentData.map((item) => (
                  <div
                    key={item.idMeteran}
                    className="bg-white border rounded-lg shadow-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {item.namaKepalaRumah}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.statusMeteran === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.statusMeteran}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ID Meteran: {item.idMeteran}
                    </p>
                    <p className="text-sm text-gray-600">
                      Alamat: {item.alamatRumah}
                    </p>

                    <div className="mt-2 flex justify-center gap-2">
                      <button
                        onClick={() => openQRCodeModal(item.idMeteran)} // Pass the idMeteran here
                        className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-lg transition duration-200"
                      >
                        Lihat QR
                      </button>
                      <button
                        onClick={() => openModal("edit", item)}
                        className="bg-amber-900 text-white hover:bg-amber-800 py-2 px-4 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePelanggan(item.idMeteran)}
                        className="bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-lg transition duration-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 bg-white hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2 border rounded-lg bg-amber-900 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 bg-white hover:bg-gray-100"
            >
              Next
            </button>
          </div>
          <div className="mt-4 text-center  text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            entries
          </div>
        </div>
      )}

      {modalState.type === "create" && (
        <CreateModal
          closeModal={closeModal}
          saveData={handleCreatePelanggan}
          rw={dataRT}
        />
      )}

      {modalState.type === "edit" && (
        <EditModal
          closeModal={closeModal}
          saveData={handleSaveEdit}
          data={modalState.data}
          rw={dataRT}
        />
      )}
      {qrModalVisible && (
        <QRModal
          qrCode={qrCode}
          onClose={closeQRCodeModal} // Pass the close function
        />
      )}
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
export default withAuth(DataPelanggan);
