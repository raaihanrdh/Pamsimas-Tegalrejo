"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalAllData from "../components/modal/allTagihan";
import { Html5Qrcode } from "html5-qrcode";
import { getAuth, withAuth } from "../utils/routerAuth";
import GenerateTagihanModal from "../components/modal/generatetagihanmodal";
import { API_URL } from "../common/api";
import { FiCamera, FiCameraOff, FiDownload } from "react-icons/fi";

const TagihanBulanan = () => {
  const [dataTagihan, setDataTagihan] = useState([]);
  const [dataAmbang, setDataAmbang] = useState({
    ambangMinimum: {
      meteranUsaha: 0,
      meteranPribadi: 0,
    },
    nominalMinimum: {
      meteranUsaha: 0,
      meteranPribadi: 0,
    },
    hargaPerKubik: {
      meteranUsaha: 0,
      meteranPribadi: 0,
    },
    biayaAdmin: {
      meteranUsaha: 0,
      meteranPribadi: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [showGenerateExcelModal, setShowGenerateExcelModal] = useState(false);
  const [showGenerateFormModal, setShowGenerateFormModal] = useState(false);
  const [showAllDataModal, setShowAllDataModal] = useState(false);
  const [editingTagihan, setEditingTagihan] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("tab1");

  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraScanner, setCameraScanner] = useState(null);
  const [idMeteran, setIdMeteran] = useState("");

  const [dataRT, setDataRT] = useState([]);
  const [selectedDataRT, setSelectedDataRT] = useState("");
  const [countTagihan, setCountTagihan] = useState(0);
  const [jenisMeteranSelected, setJenisMeteranSelected] = useState("");
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
    console.log(user.permissions.pelanggan);
  }, []);

  useEffect(() => {
    if (showScanner) {
      startScanner();
    }
  }, [showScanner]);
  const startScanner = () => {
    const html5Qrcode = new Html5Qrcode("reader");
    setCameraScanner(html5Qrcode);

    const qrCodeSuccessCallback = (decodedText) => {
      html5Qrcode
        .stop()
        .then(() => {
          console.log(`QR Code Stopped, idMeteran: ${decodedText}`);
          setIdMeteran(decodedText);
          closeModal();
          setActiveTab("tab1");
        })
        .catch((err) => {
          console.log(err);
          setActiveTab("tab1");
        });
    };
    const getResponsiveQrBox = () => {
      const windowWidth = window.innerWidth;
      const minBoxSize = 200;
      const maxBoxSize = 500;
      const calculatedSize = Math.floor(windowWidth * 0.7);
      return Math.max(minBoxSize, Math.min(calculatedSize, maxBoxSize));
    };

    const config = {
      fps: 10,
      qrbox: getResponsiveQrBox(),
    };

    html5Qrcode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback
    );
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());

      openScanModal();
      setCameraError(null);
    } catch (error) {
      setCameraError("Akses kamera diperlukan untuk memindai kode QR");
      console.error("Kesalahan akses kamera:", error);
    }
  };

  const stopScanner = () => {
    if (cameraScanner) {
      setShowScanner(false);
      const html5QrCode = new Html5Qrcode("reader");
      cameraScanner.stop();
      setCameraError(null);
    }
  };

  useEffect(() => {
    const fetchTagihanByIdMeteran = async (idMeteran) => {
      setDataTagihan([]);
      try {
        const response = await axios.get(
          `${API_URL}/tagihan?idMeteran=${idMeteran}`
        );
        const data = response.data.data;
        if (Array.isArray(data)) {
          setDataTagihan(data);
          setFilteredData(data);
        } else {
          console.error("Data tagihan bukan array:", data);
          setDataTagihan([]);
          setFilteredData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }

      let result = [...dataTagihan];
      if (statusFilter !== "all") {
        result = result.filter(
          (item) => item.statusPembayaran === statusFilter
        );
      }
      if (searchQuery) {
        result = result.filter((item) =>
          Object.values(item).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      setFilteredData(result);
      setCurrentPage(1);
    };

    const countNow = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/tagihan/countnow`);
        const data = await response.json();
        setCountTagihan(data.data);
        console.log(`TAGIHAN NOW: ${data.data}`);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    countNow();
    const fetchRT = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/pelangganRTRW`);
        const data = await response.json();
        setDataRT(data.data.sort((a, b) => a._id.localeCompare(b._id)));
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (idMeteran) {
      console.log(`ID METERAN FOUND BY SCAN: ${idMeteran}`);
      fetchTagihanByIdMeteran(idMeteran);
    }

    fetchRT();
    console.log(dataRT);
  }, [idMeteran]);

  const fetchJenisMeteranSelected = async (idMeteran) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/pelanggan/${idMeteran}/detail`
      );
      if (response.status === 200) {
        const data = response.data.data.jenisMeteran;
        setJenisMeteranSelected(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmbangByRT = async (rw) => {
    setDataAmbang({}); // Kosongkan data sebelumnya untuk mencegah lag saat refresh
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/ambang?dusunRTRW=${rw}`);
      if (response.status === 200) {
        const data = response.data.data;
        setDataAmbang(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTagihanByRT = async (rw) => {
    fetchAmbangByRT(rw);
    setSelectedDataRT(rw);
    setDataTagihan([]); // Kosongkan data sebelumnya untuk mencegah lag saat refresh
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/tagihan/now?alamatRumah=${rw}`
      );
      const data = response.data.data;

      if (Array.isArray(data)) {
        setDataTagihan(data); // Data berhasil diterima
      } else {
        console.error("Data tagihan bukan array:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...dataTagihan];

    if (statusFilter !== "all") {
      result = result.filter((item) => item.statusPembayaran === statusFilter);
    }

    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [dataTagihan, statusFilter, searchQuery]);

  useEffect(() => {
    let result = [...dataTagihan];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.statusPembayaran === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    const totalPages = Math.ceil(result.length / itemsPerPage);
    // Apply pagination
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);

    setFilteredData(currentItems);
    setTotalPages(totalPages);
  }, [statusFilter, searchQuery, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchTagihan = async () => {
    setDataTagihan([]);
    setFilteredData();
    try {
      const response = await axios.get(`${API_URL}/tagihan`);
      const data = response.data.data;

      if (Array.isArray(data)) {
        setDataTagihan(data);
        setFilteredData(data);
      } else {
        console.error("Data tagihan bukan array:", data);
        setDataTagihan([]);
        setFilteredData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const handleGenerateTagihan = async () => {
    try {
      console.log("Tagihan sedang di generate...");
      const response = await axios.post(`${API_URL}/tagihan/generate`);
      if (response.status == 200) {
        alert("Tagihan berhasil digenerate!");
        fetchTagihan();
      } else {
        console.log(response.json().message);
      }
    } catch (error) {
      console.error("Error generating tagihan:", error);
      alert("Terjadi kesalahan saat generate tagihan.");
    }
  };

  const handleUpdateTagihan = async () => {
    try {
      const updatedTagihan = {
        ...editingTagihan,
        metodeBayar: editingTagihan.metodeBayar || "Cash",
      };

      // Update tagihan
      if (updatedTagihan) {
        await axios.put(
          `${API_URL}/tagihan/${updatedTagihan.idTagihan}/detail`,
          updatedTagihan
        );
        alert("Tagihan berhasil diupdate!");
        setDataTagihan((prevTagihan) =>
          prevTagihan.map((tagihan) =>
            tagihan.idTagihan === updatedTagihan.idTagihan
              ? updatedTagihan
              : tagihan
          )
        );
        setEditingTagihan(null);
      }
    } catch (error) {
      console.error("Error updating tagihan:", error);
      alert("Terjadi kesalahan saat update tagihan.");
    }
  };

  const handleEditTagihan = (tagihan) => {
    setEditingTagihan(tagihan);
    fetchJenisMeteranSelected(tagihan.idMeteran);
    fetchAmbangByRT(tagihan.alamatRumah);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    let updatedTagihan = { ...editingTagihan, [name]: value };

    if (name === "meteranSekarang" && value !== "") {
      const meteranHitungan =
        updatedTagihan.meteranSekarang - updatedTagihan.meteranSebelumnya;

      var totalTagihan = 0;

      let factorTotalTagihan = 0;
      let biayaAdmin = 0;

      // Logic penentuan harga
      if (jenisMeteranSelected) {
        if (jenisMeteranSelected == "Pribadi") {
          if (meteranHitungan <= dataAmbang.ambangMinimum.meteranPribadi) {
            totalTagihan = dataAmbang.nominalMinimum.meteranPribadi;
          } else {
            totalTagihan = meteranHitungan;
            factorTotalTagihan = dataAmbang.hargaPerKubik.meteranPribadi;
            biayaAdmin = dataAmbang.biayaAdmin.meteranPribadi;
            totalTagihan = (
              dataAmbang.nominalMinimum.meteranPribadi +
              (totalTagihan - dataAmbang.ambangMinimum.meteranPribadi) *
                factorTotalTagihan +
              biayaAdmin
            ).toString();
          }
        } else {
          if (meteranHitungan <= dataAmbang.ambangMinimum.meteranUsaha) {
            totalTagihan = dataAmbang.nominalMinimum.meteranUsaha;
          } else {
            totalTagihan = meteranHitungan;
            factorTotalTagihan = dataAmbang.hargaPerKubik.meteranUsaha;
            biayaAdmin = dataAmbang.biayaAdmin.meteranUsaha;
            totalTagihan = (
              dataAmbang.nominalMinimum.meteranUsaha +
              (totalTagihan - dataAmbang.ambangMinimum.meteranUsaha) *
                factorTotalTagihan +
              biayaAdmin
            ).toString();
          }
        }
      } else {
        if (meteranHitungan < dataAmbang.ambangMinimum.meteranPribadi) {
          totalTagihan = dataAmbang.nominalMinimum.meteranPribadi;
        } else {
          totalTagihan = meteranHitungan;
          factorTotalTagihan = dataAmbang.hargaPerKubik.meteranPribadi;
          biayaAdmin = dataAmbang.biayaAdmin.meteranPribadi;
          totalTagihan = (
            dataAmbang.nominalMinimum.meteranUsaha +
            (totalTagihan - dataAmbang.ambangMinimum.meteranUsaha) *
              factorTotalTagihan +
            biayaAdmin
          ).toString();
        }
      }

      updatedTagihan.totalTagihan = totalTagihan;
    }
    if (name === "statusPembayaran" && value === "Lunas") {
      updatedTagihan.tanggalBayar = new Date().toISOString().split("T")[0];
    }

    setEditingTagihan(updatedTagihan);
  };

  const openScanModal = () => {
    setShowScanner(true);
  };

  const openAllDataModal = () => {
    setShowAllDataModal(true);
    setShowGenerateFormModal(false);
  };

  const closeModal = () => {
    setShowGenerateFormModal(false);
    setShowGenerateExcelModal(false);
    setShowScanner(false);
    setShowAllDataModal(false);
    setEditingTagihan(null);
  };

  return (
    <div className="min-h-screen p-5 ">
      <div className="flex">
        <h1 className="text-2xl font-semibold mb-4">Data Tagihan PAMSIMAS</h1>
        <div className="flex-">
          {countTagihan == 0 && (
            <button
              className=" bg-blue-500 px-3 py-2 rounded-lg text-white"
              onClick={handleGenerateTagihan}
            >
              + Generate
            </button>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex mb-4 border-b items-center justify-between">
        <div className="flex">
          <button
            className={`py-2 px-4 mr-2 ${
              activeTab === "tab1"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tab1")}
          >
            Data Tagihan
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "tab2"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("tab2");
              openAllDataModal();
            }}
          >
            All Data
          </button>
        </div>
        <div className="flex space-x-2">
          {user.permissions.tagihan.create === 1 && (
            <button
              onClick={() => setShowGenerateExcelModal(true)}
              className="flex items-center bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700"
            >
              <FiDownload className="mr-3" /> Excel
            </button>
          )}

          {user.permissions.tagihan.read === 1 && (
            <button
              onClick={requestCameraPermission}
              className="flex items-center bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600"
            >
              <FiCamera className="mr-3" /> Scan
            </button>
          )}
        </div>
      </div>

      {showGenerateExcelModal && (
        <GenerateTagihanModal
          closeModal={closeModal}
          alamatRumah={selectedDataRT}
        />
      )}

      {/* Modals remain the same */}
      {showGenerateFormModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl mb-4">Generate Tagihan</h2>
            <button
              onClick={handleGenerateTagihan}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Generate Tagihan
            </button>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white py-2 px-4 ml-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative w-11/12 max-w-lg bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Pindai Kode QR
            </h2>
            <div
              id="reader"
              className="w-full h-64 border border-gray-300 rounded-md overflow-hidden"
            />
            <button
              onClick={() => stopScanner()}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            >
              ✕
            </button>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Pastikan kode QR berada di dalam bingkai dan cukup terang untuk
              memindai.
            </p>
          </div>
        </div>
      )}

      {activeTab === "tab1" && (
        <div className="bg-white shadow-lg p-5">
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
                    className={`px-3 py-2 rounded-lg shadow flex-grow md:flex-shrink-0 
            ${
              rw === rw._id ? "bg-blue-500 text-white" : "bg-gray-200"
            } hover:bg-blue-400 text-xs md:text-sm`}
                  >
                    {rtRwText}
                  </button>
                );
              })}
          </div>

          <h2 className="text-xl font-bold mb-4 text-center">
            Daftar Tagihan Bulan Ini
          </h2>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <input
                type="text"
                placeholder="Cari tagihan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="all">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value={5}>5 per halaman</option>
                <option value={10}>10 per halaman</option>
                <option value={20}>20 per halaman</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto w-full rounded-2xl">
            <table className="min-w-full table-auto text-xs sm:text-sm">
              <thead className="bg-amber-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    ID Meteran
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Nama Pelanggan
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Meteran Sebelumnya
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Meteran Sekarang
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Total Tagihan
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Status Pembayaran
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Tanggal Bayar
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Metode Bayar
                  </th>
                  <th className="px-6 py-4 text-center border-b border-gray-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((tagihan, index) => (
                  <tr
                    key={tagihan.idTagihan}
                    className={`transition duration-300 ease-in-out hover:bg-amber-100 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.idMeteran}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.namaKepalaRumah}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.meteranSebelumnya}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.meteranSekarang}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.totalTagihan}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-full inline-block text-white ${
                          tagihan.statusPembayaran === "Lunas"
                            ? "bg-green-500"
                            : tagihan.statusPembayaran === "Belum Lunas"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {tagihan.statusPembayaran}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.tanggalBayar}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      {tagihan.metodeBayar}
                    </td>
                    <td className="px-6 py-4 text-center border-b border-gray-300">
                      <button
                        value={tagihan.idMeteran}
                        onClick={(event) => {
                          handleEditTagihan(tagihan);
                        }}
                        className="bg-amber-900 hover:bg-amber-800 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {dataTagihan.map((tagihan) => (
              <div
                key={tagihan.idTagihan}
                className="bg-white p-4 border rounded-lg shadow-md"
              >
                <div className="mb-4">
                  <p className="font-bold">ID Tagihan:</p>
                  <p className="font-extrabold italic">{tagihan.idTagihan}</p>
                </div>

                <div className="mb-4">
                  <p className="font-bold">ID Meteran:</p>
                  <p className="font-extrabold ">{tagihan.idMeteran}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Meteran Sebelumnya:</p>
                  <p>{tagihan.meteranSebelumnya}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Meteran Sekarang:</p>
                  <p>{tagihan.meteranSekarang}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Total Tagihan:</p>
                  <p>{tagihan.totalTagihan}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Status Pembayaran:</p>
                  <p>{tagihan.statusPembayaran}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Tanggal Bayar:</p>
                  <p>{tagihan.tanggalBayar}</p>
                </div>
                <div className="mb-4">
                  <p className="font-bold">Metode Bayar:</p>
                  <p>{tagihan.metodeBayar}</p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleEditTagihan(tagihan)}
                    className="bg-amber-900 text-white  py-2 px-6 mt-2 rounded-full"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between mb-10 items-center space-y-4 sm:space-y-0 ">
            <div className="mt-2 text-center sm:text-left text-sm">
              Showing{" "}
              {currentPage === totalPages
                ? `${(currentPage - 1) * itemsPerPage + 1} to ${
                    filteredData.length
                  }`
                : `${(currentPage - 1) * itemsPerPage + 1} to ${
                    currentPage * itemsPerPage
                  }`}{" "}
              of {countTagihan} entries
            </div>
            <div className="flex items-center space-x-2 ">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 
                       text-xs sm:text-sm bg-white hover:bg-gray-100"
              >
                sebelumnya
              </button>

              <span className="px-3 py-2 bg-amber-900 text-white rounded-lg text-xs sm:text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 
                       text-xs sm:text-sm bg-white hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "tab2" && showAllDataModal && (
        <ModalAllData
          showGenerateExcelModal={showGenerateExcelModal}
          alamatRumah={selectedDataRT}
          closeModal={() => {
            closeModal();
            setActiveTab("tab1");
          }}
        />
      )}
      {editingTagihan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl mb-4">Edit Tagihan</h2>
            <div className="mb-4">
              <label className="block mb-2">Meteran Sebelumnya</label>
              <input
                type="number"
                name="meteranSebelumnya"
                value={editingTagihan.meteranSebelumnya}
                onChange={handleChangeInput}
                disabled
                className="py-2 px-4 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Meteran Sekarang</label>
              <input
                type="number"
                name="meteranSekarang"
                value={editingTagihan.meteranSekarang}
                onChange={handleChangeInput}
                className="py-2 px-4 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Total Tagihan</label>
              <input
                type="text"
                value={
                  editingTagihan.totalTagihan
                    ? editingTagihan.totalTagihan
                    : "0"
                }
                disabled
                className="py-2 px-4 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Status Pembayaran</label>
              <select
                name="statusPembayaran"
                value={editingTagihan.statusPembayaran}
                onChange={handleChangeInput}
                className="py-2 px-4 border border-gray-300 rounded"
              >
                <option>Pilih</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Metode Bayar</label>
              <select
                name="metodeBayar"
                value={editingTagihan.metodeBayar}
                onChange={handleChangeInput}
                className="py-2 px-4 border border-gray-300 rounded"
              >
                <option>Pilih</option>
                <option value="QRIS">QRIS</option>
                <option value="Transfer">Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <button
              onClick={handleUpdateTagihan}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Update Tagihan
            </button>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white py-2 px-4 ml-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(TagihanBulanan);
