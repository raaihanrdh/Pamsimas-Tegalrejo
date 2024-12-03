"use client";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraScanner, setCameraScanner] = useState(null);

  useEffect(() => {
    // Memulai pemindaian QR hanya jika showScanner berubah menjadi true
    if (showScanner) {
      startScanner();
    }
  }, [showScanner]); // Menambahkan showScanner sebagai dependensi

  const startScanner = () => {
    const html5Qrcode = new Html5Qrcode("reader");
    setCameraScanner(html5Qrcode);

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      html5Qrcode.stop()
      .then(() => {
        console.log("QR Code Stopped")
      })
      .catch((err) => {
        console.log(err)
      }); // Hentikan scanner setelah berhasil mendeteksi QR code
      setShowScanner(false); // Sembunyikan scanner
      setScanResult(decodedText);
    };

    // const qrCodeErrorCallback = (errorMessage) => {
    //   setCameraError(errorMessage); // Set error jika pemindaian gagal
    //   console.error(errorMessage);
    // };

    const config = { fps: 10, qrbox: 250 };

    // Mulai pemindaian dengan konfigurasi dan callback
    html5Qrcode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      // qrCodeErrorCallback
    );
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Tutup stream setelah dicek
      stream.getTracks().forEach((track) => track.stop());

      setShowScanner(true); // Tampilkan scanner setelah mendapat izin
      setCameraError(null); // Reset error kamera
    } catch (error) {
      setCameraError("Akses kamera diperlukan untuk memindai kode QR");
      console.error("Kesalahan akses kamera:", error);
    }
  };

  const stopScanner = () => {
    if(cameraScanner) {
    setShowScanner(false); // Menyembunyikan scanner saat berhenti
    const html5QrCode = new Html5Qrcode("reader");
    cameraScanner.stop();
    setCameraError(null); // Reset error kamera
    }    
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <button
        onClick={requestCameraPermission}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
      >
        Pindai Kode QR
      </button>

      {cameraError && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {cameraError}
        </div>
      )}

      {showScanner && (
        <div className="relative w-full h-64">
          <div id="reader" className="w-full h-full" />
          <button
            onClick={() => stopScanner()}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
          >
            Batalkan
          </button>
        </div>
      )}

      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold mb-2">Hasil Scan:</h3>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
}
