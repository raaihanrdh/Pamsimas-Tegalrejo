import { useState } from "react";

export default function EditModal({ closeModal, saveData, data, rw }) {
  const [formData, setFormData] = useState(data); // Menyimpan data awal ke state

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update state sesuai nama input
    }));
  };

  const handleSave = () => {
    const updatedData = {
      idMeteran: formData.idMeteran,
      namaKepalaRumah: formData.namaKepalaRumah,
      jenisMeteran: formData.jenisMeteran,
      statusMeteran: formData.statusMeteran,
      // Tambahkan data lainnya yang relevan
    };
    saveData(updatedData); // Kirim data ke parent untuk disimpan
    closeModal(); // Tutup modal setelah data berhasil disimpan
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Pelanggan
        </h2>
        <form className="space-y-5">
          {/* Input Nama Kepala Rumah */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nama Kepala Rumah
            </label>
            <input
              type="text"
              name="namaKepalaRumah"
              value={formData.namaKepalaRumah}
              onChange={handleChange}
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
                name="alamatRumah"
                value={formData.alamatRumah}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option>Pilih Alamat Rumah</option>
                { rw && rw.map((rw) => {
                  return(
                    <option key={rw._id} value={rw._id}>{rw._id}</option>
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
              name="jenisMeteran"
              value={formData.jenisMeteran}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option key="Pribadi" value="Pribadi">Pribadi</option>
              <option key="Usaha" value="Usaha">Usaha</option>
            </select>
          </div>
          {/* Input Status Meteran */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Status Meteran
            </label>
            <select
              name="statusMeteran"
              value={formData.statusMeteran}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          {/* Tombol Tutup dan Simpan */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
