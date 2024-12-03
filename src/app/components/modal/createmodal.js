import { useState } from "react";

export default function CreateModal({ closeModal, saveData, rw }) {
  const [namaKepalaRumah, setNamaKepalaRumah] = useState("");
  const [alamatRumah, setAlamatRumah] = useState("");
  const [statusMeteran, setStatusMeteran] = useState("Aktif");
  const [jenisMeteran, setJenisMeteran] = useState("Pribadi");

  const handleCreate = () => {
    const newData = { namaKepalaRumah, alamatRumah, statusMeteran, jenisMeteran };
    saveData(newData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Tambah Data Pelanggan
        </h2>
        <div className="space-y-5">
          {/* Nama Kepala Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nama Kepala Rumah
            </label>
            <input
              type="text"
              value={namaKepalaRumah}
              onChange={(e) => setNamaKepalaRumah(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Masukkan nama kepala rumah"
            />
          </div>
          {/* Alamat Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Alamat Rumah
            </label>
            <select
                value={alamatRumah}
                onChange={(e) => setAlamatRumah(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option>Pilih Alamat Rumah</option>
                { rw && rw.map((rw) => {
                  return(
                    <option value={rw._id}>{rw._id}</option>
                  )
                }) }
              </select>
          </div>
          {/* Jenis Meteran */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Jenis Meteran
            </label>
            <select
              value={jenisMeteran}
              onChange={(e) => setJenisMeteran(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="Pribadi">Pribadi</option>
              <option value="Usaha">Usaha</option>
            </select>
          </div>
          {/* Status Meteran */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Status Meteran
            </label>
            <select
              value={statusMeteran}
              onChange={(e) => setStatusMeteran(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>
        {/* Tombol */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
