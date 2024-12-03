import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function GenerateTagihanModal({ closeModal, alamatRumah }) {
  const [bulanTagihan, setBulanTagihan] = useState("");
  const [tahunTagihan, setTahunTagihan] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading
  const [excelData, setExcelData] = useState(null);
  const ROOT_API = process.env.NEXT_PUBLIC_API;
  const API_V = process.env.NEXT_PUBLIC_API_V;

  const handleGenerate = async () => {
    if (!bulanTagihan) {
      setErrorMessage("Harap pilih bulan terlebih dahulu.");
      return;
    }

    if (!tahunTagihan) {
      setErrorMessage("Harap pilih tahun terlebih dahulu.");
      return;
    }

    setIsLoading(true); // Set loading true saat tombol ditekan

    if (alamatRumah) {
      const response = await fetch(
        `${ROOT_API}/${API_V}/generatetagihan?alamatRumah=${alamatRumah}&bulanTagihan=${bulanTagihan}&tahunTagihan=${tahunTagihan}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setExcelData(url);
        setErrorMessage(""); // Reset pesan error setelah sukses

        // Trigger download otomatis setelah excelData di-set
        const link = document.createElement("a");
        link.href = url;
        link.download = `tagihan_${bulanTagihan}_${tahunTagihan}_${alamatRumah}.xlsx`;
        link.click();
        closeModal(); // Close modal setelah download
      } else {
        setErrorMessage("Data tidak ditemukan. Silakan coba lagi.");
      }
    } else {
      setErrorMessage("Alamat rumah tidak valid.");
    }

    setIsLoading(false); // Reset loading setelah selesai
  };

  const handleBulanTagihan = (value) => {
    setBulanTagihan(value);
    setErrorMessage("");
  };

  const handleTahunTagihan = (value) => {
    setTahunTagihan(value);
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6"></h2>
        <div className="space-y-5">
          {/* Bulan */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Pilih Bulan
            </label>
            <select
              id="bulanSelect"
              value={bulanTagihan}
              onChange={(e) => handleBulanTagihan(e.target.value)}
              className="w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:ring-amber-800 focus:border-amber-800"
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
          {/* Tahun */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Pilih Tahun
            </label>
            <select
              id="tahunSelect"
              value={tahunTagihan}
              onChange={(e) => handleTahunTagihan(e.target.value)}
              className="w-full py-2 px-3 border-gray-400 rounded-md border shadow-sm focus:ring-amber-800 focus:border-amber-800"
            >
              <option value="">--Pilih Tahun--</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>
        {/* Pesan Error */}
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
        {/* Tombol */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading} // Disable tombol jika sedang loading
            className="px-4 py-2 text-sm font-medium text-white bg-amber-800 rounded-lg shadow-md hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-800"
          >
            {isLoading ? (
              <span className="animate-spin">
                {" "}
                <FiLoader size={28} />
              </span>
            ) : (
              "Generate Excel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
