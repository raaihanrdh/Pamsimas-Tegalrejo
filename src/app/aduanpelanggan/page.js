"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheck, FiSend } from "react-icons/fi";
import { API_URL } from "../common/api";

export default function CreatePengaduan() {
  const [idMeteran, setIdMeteran] = useState("");
  const [nama, setNama] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageType("");
    setResponseMessage("");

    const fullMessage = `Nama: ${nama}\nNo Telp: ${nomorTelepon}\nPesan: ${pesan}`;

    try {
      const response = await fetch(`${API_URL}/pengaduan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idMeteran, pesan: fullMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset all form fields
        setIdMeteran("");
        setNama("");
        setNomorTelepon("");
        setPesan("");

        setResponseMessage("Pengaduan berhasil dikirim!");
        setMessageType("success");
      } else {
        setResponseMessage(data.message || "Gagal mengirim pengaduan.");
        setMessageType("error");
      }
    } catch (error) {
      setResponseMessage("Terjadi kesalahan: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 via-amber-900 to-amber-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-amber-800 p-6">
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-md">
            Buat Pengaduan
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label
              htmlFor="idMeteran"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              ID Meteran
            </label>
            <input
              type="text"
              id="idMeteran"
              value={idMeteran}
              onChange={(e) => setIdMeteran(e.target.value)}
              required
              placeholder="Masukkan ID Meteran Anda"
              className="w-full px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl 
                       focus:ring-4 focus:ring-amber-300 focus:outline-none 
                       transition duration-300 ease-in-out 
                       placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="nama"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Nama
            </label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              placeholder="Nama Lengkap"
              className="w-full px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl 
                       focus:ring-4 focus:ring-amber-300 focus:outline-none 
                       transition duration-300 ease-in-out 
                       placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="nomorTelepon"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="nomorTelepon"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              required
              placeholder="Nomor Telepon Aktif"
              className="w-full px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl 
                       focus:ring-4 focus:ring-amber-300 focus:outline-none 
                       transition duration-300 ease-in-out 
                       placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="pesan"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Pesan Pengaduan
            </label>
            <textarea
              id="pesan"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              required
              placeholder="Tuliskan detail pengaduan Anda"
              rows="5"
              className="w-full px-5 py-3 bg-gray-100 border border-gray-300 rounded-xl 
                       focus:ring-4 focus:ring-amber-300 focus:outline-none 
                       transition duration-300 ease-in-out 
                       placeholder-gray-500"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 
                       px-8 py-3 bg-amber-800 text-white font-semibold rounded-2xl 
                       hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 
                       disabled:opacity-50 transition duration-300 ease-in-out 
                       shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin">○</span>
                  Mengirim...
                </>
              ) : (
                <>
                  <FiSend size={20} />
                  Kirim Pengaduan
                </>
              )}
            </button>
          </div>
        </form>

        {responseMessage && (
          <div
            className={`
          p-4 mx-8 mb-6 rounded-xl text-center flex items-center justify-center gap-2
          ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        `}
          >
            {messageType === "success" ? (
              <FiCheck size={24} />
            ) : (
              <FiAlertCircle size={24} />
            )}
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}
