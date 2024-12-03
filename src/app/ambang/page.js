"use client";
import React, { useState, useEffect } from "react";
import EditAmbangModal from "../components/modal/editAmbangModal";
import Toast from "../components/Toast/successToast";
import { inconsolata } from "../components/Fonts/fonts";
import { API_URL } from "../common/api";
import { getAuth, withAuth } from "../utils/routerAuth";

const AmbangPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDusun, setSelectedDusun] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
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
      akun: {
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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/ambang`);
      const result = await response.json();
      if (result.data) {
        setData(
          result.data.sort((a, b) => a.dusunRTRW.localeCompare(b.dusunRTRW))
        );
      }
    } catch (error) {
      console.error("Error fetching ambang data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDusunSelect = (dusun) => {
    setSelectedDusun(dusun);
  };

  const filteredData = selectedDusun
    ? data.filter((row) => row.dusunRTRW === selectedDusun)
    : [];

  return (
    <div className="min-h-screen p-5">
      <h2 className={`${inconsolata.className} text-4xl font-semibold mb-4`}>
        Setting Daftar Ambang
      </h2>
      <div className="w-full mt-8 p-5 bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="animate-spin text-center text-lg text-gray-500">
            Loading...
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                htmlFor="dusun"
                className="block text-lg sm:text-xl font-semibold mb-2"
              >
                Pilih Dusun
              </label>
              <select
                id="dusun"
                onChange={(e) => handleDusunSelect(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="">-- Pilih Dusun --</option>
                {data.map((row, index) => (
                  <option key={index} value={row.dusunRTRW}>
                    {row.dusunRTRW}
                  </option>
                ))}
              </select>
            </div>
            {selectedDusun && filteredData.length > 0 && (
              <div className="overflow-x-auto w-full rounded-2xl">
                <table className="min-w-full table-auto text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-800 text-white">
                      <th className="px-6 py-4 text-center border-b border-gray-300">
                        Item
                      </th>
                      <th className="px-6 py-4 text-center border-b border-gray-300">
                        Meteran Usaha
                      </th>
                      <th className="px-6 py-4 text-center border-b border-gray-300">
                        Meteran Pribadi
                      </th>
                      {user.permissions.ambang.update === 1 && (
                        <th className="px-6 py-4 text-center border-b border-gray-300">
                          Aksi
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <React.Fragment key={index}>
                        <tr
                          className={`${
                            index % 2 === 1 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200`}
                        >
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            Ambang Minimum
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.ambangMinimum.meteranUsaha}
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.ambangMinimum.meteranPribadi}
                          </td>
                          {user.permissions.ambang.update === 1 && (
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-white bg-amber-800 px-3 py-2 rounded-lg font-semibold hover:underline"
                              >
                                Ubah
                              </button>
                            </td>
                          )}
                        </tr>
                        <tr
                          className={`${
                            index % 2 === 1 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200`}
                        >
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            Nominal Minimal
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.nominalMinimum.meteranUsaha}
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.nominalMinimum.meteranPribadi}
                          </td>
                          {user.permissions.ambang.update === 1 && (
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-white bg-amber-800 px-3 py-2 rounded-lg font-semibold hover:underline"
                              >
                                Ubah
                              </button>
                            </td>
                          )}
                        </tr>
                        <tr
                          className={`${
                            index % 2 === 1 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200`}
                        >
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            Harga Per Kubik
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.hargaPerKubik.meteranUsaha}
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.hargaPerKubik.meteranPribadi}
                          </td>
                          {user.permissions.ambang.update === 1 && (
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-white bg-amber-800 px-3 py-2 rounded-lg font-semibold hover:underline"
                              >
                                Ubah
                              </button>
                            </td>
                          )}
                        </tr>
                        <tr
                          className={`${
                            index % 2 === 1 ? "bg-gray-100" : "bg-white"
                          } hover:bg-gray-200`}
                        >
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            Biaya Admin
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.biayaAdmin.meteranUsaha}
                          </td>
                          <td className="px-6 py-4 text-center border-b border-gray-300">
                            {row.biayaAdmin.meteranPribadi}
                          </td>
                          {user.permissions.ambang.update === 1 && (
                            <td className="px-6 py-4 text-center border-b border-gray-300">
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-white bg-amber-800 px-3 py-2 rounded-lg font-semibold hover:underline"
                              >
                                Ubah
                              </button>
                            </td>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {modalOpen && editData && (
          <EditAmbangModal
            editData={editData}
            setModalOpen={setModalOpen}
            fetchData={fetchData} // Pastikan ini diteruskan
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
    </div>
  );
};
export default withAuth(AmbangPage);
