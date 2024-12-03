import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { API_URL } from "@/app/common/api";
import Toast from "../Toast/successToast";

export default function EditAmbangModal({
  editData,
  setModalOpen,
  setData,
  fetchData, // Add a prop to fetch fresh data after update
}) {
  const [formData, setFormData] = useState({
    ambangMinimumUsaha: editData.ambangMinimum.meteranUsaha,
    ambangMinimumPribadi: editData.ambangMinimum.meteranPribadi,
    nominalMinimumUsaha: editData.nominalMinimum.meteranUsaha,
    nominalMinimumPribadi: editData.nominalMinimum.meteranPribadi,
    hargaPerKubikUsaha: editData.hargaPerKubik.meteranUsaha,
    hargaPerKubikPribadi: editData.hargaPerKubik.meteranPribadi,
    biayaAdminUsaha: editData.biayaAdmin.meteranUsaha,
    biayaAdminPribadi: editData.biayaAdmin.meteranPribadi,
  });

  const [updateAllDusun, setUpdateAllDusun] = useState(false); // Manage the checkbox state
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle checkbox change to toggle updating all dusun
  const handleCheckboxChange = (e) => {
    setUpdateAllDusun(e.target.checked);
  };

  // Save the data when form is submitted
  const handleSave = async () => {
    if (isLoading) return;

    const updatedData = {
      ambangMinimum: {
        meteranUsaha: formData.ambangMinimumUsaha,
        meteranPribadi: formData.ambangMinimumPribadi,
      },
      nominalMinimum: {
        meteranUsaha: formData.nominalMinimumUsaha,
        meteranPribadi: formData.nominalMinimumPribadi,
      },
      hargaPerKubik: {
        meteranUsaha: formData.hargaPerKubikUsaha,
        meteranPribadi: formData.hargaPerKubikPribadi,
      },
      biayaAdmin: {
        meteranUsaha: formData.biayaAdminUsaha,
        meteranPribadi: formData.biayaAdminPribadi,
      },
    };

    setIsLoading(true);

    try {
      const endpoint = updateAllDusun
        ? `${API_URL}/ambang` // Endpoint for updating all dusun
        : `${API_URL}/ambang/${editData.dusunRTRW}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success handling for specific or all dusun update
        if (!updateAllDusun && result.data.modifiedCount > 0) {
          setToastType("success");
          setResponseMessage(result.message || "Update Data Dusun Berhasil.");
        } else if (updateAllDusun) {
          setToastType("success");
          setResponseMessage("Update Data Untuk Semua Dusun Berhasil.");
        } else {
          setToastType("error");
          setResponseMessage(result.message || "Update gagal.");
        }

        // Optionally refresh data after successful update
        if (fetchData) {
          fetchData();
        }
      } else {
        setToastType("error");
        setResponseMessage(
          result.message || "Terjadi kesalahan saat memperbarui data."
        );
      }
    } catch (error) {
      console.error("Error updating ambang data:", error.message);
      setToastType("error");
      setResponseMessage("Terjadi kesalahan saat memperbarui data.");
    } finally {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Data Ambang</h3>
          <button
            onClick={() => setModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Ambang Minimum Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Ambang Minimum Usaha</label>
              <input
                type="number"
                name="ambangMinimumUsaha"
                value={formData.ambangMinimumUsaha}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Ambang Minimum Pribadi
              </label>
              <input
                type="number"
                name="ambangMinimumPribadi"
                value={formData.ambangMinimumPribadi}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Nominal Minimum Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">
                Nominal Minimum Usaha
              </label>
              <input
                type="number"
                name="nominalMinimumUsaha"
                value={formData.nominalMinimumUsaha}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Nominal Minimum Pribadi
              </label>
              <input
                type="number"
                name="nominalMinimumPribadi"
                value={formData.nominalMinimumPribadi}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Harga Per Kubik Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">
                Harga Per Kubik Usaha
              </label>
              <input
                type="number"
                name="hargaPerKubikUsaha"
                value={formData.hargaPerKubikUsaha}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">
                Harga Per Kubik Pribadi
              </label>
              <input
                type="number"
                name="hargaPerKubikPribadi"
                value={formData.hargaPerKubikPribadi}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Biaya Admin Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Biaya Admin Usaha</label>
              <input
                type="number"
                name="biayaAdminUsaha"
                value={formData.biayaAdminUsaha}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Biaya Admin Pribadi</label>
              <input
                type="number"
                name="biayaAdminPribadi"
                value={formData.biayaAdminPribadi}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Update All Dusun Checkbox */}
          <div className="flex items-center mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={updateAllDusun}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Update Semua Dusun</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setModalOpen(false)}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`py-2 px-4 rounded text-sm ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>
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
}
