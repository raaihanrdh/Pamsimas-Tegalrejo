import React from "react";

const QRModal = ({ qrCode, onClose }) => {
  // Memastikan qrCode adalah base64 image
  const imageSource = qrCode.startsWith("data:image/png;base64,")
    ? qrCode
    : `data:image/png;base64,${qrCode}`;

  // Fungsi untuk menutup modal jika area luar modal diklik
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  // Fungsi untuk menangani unduhan QR Code
  const handleDownload = () => {
    // Membuat elemen anchor secara dinamis untuk mengunduh file
    const link = document.createElement("a");
    link.href = imageSource; // Sumber gambar base64
    link.download = "QRCode.png"; // Nama file yang akan diunduh
    link.click(); // Simulasikan klik pada link untuk memulai unduhan
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm sm:max-w-lg w-full transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold mb-4 text-center">QR Code</h2>
        <div className="text-center mb-4">
          <img
            src={imageSource}
            alt="QR Code"
            className="max-w-full h-auto rounded-md"
          />
        </div>
        <div className="flex gap-4 justify-center">
          {/* Tombol Download QR Code */}
          <button
            onClick={handleDownload}
            className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download QR
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default QRModal;
