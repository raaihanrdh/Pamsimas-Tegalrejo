import React from "react";
import { FiAlertCircle, FiFileText, FiSearch, FiLogIn } from "react-icons/fi";

const LandingPage = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-amber-600 via-amber-800 to-amber-600 flex flex-col items-center justify-center text-white relative">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">PAMSIMAS</h1>
        <a
          href="/login"
          className="flex items-center gap-2 py-2 px-4 bg-white text-amber-900 rounded-full shadow-lg hover:bg-amber-800 hover:text-white transition duration-300"
        >
          <FiLogIn />
          Sign In
        </a>
      </header>

      {/* Hero Section */}
      <div className="text-center mt-20 px-6">
        <div className="bg-amber-800 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <img
              src="/logolerep.png"
              alt="PAMSIMAS Logo"
              className="w-50 h-20"
            />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Selamat Datang di
            <span className="text-amber-800"> PAMSIMAS</span>
          </h1>
          <p className="text-lg font-light max-w-md mx-auto mb-6">
            Platform untuk mengelola kebutuhan air bersih desa Anda dengan mudah
            dan cepat.
          </p>

          {/* Button Section */}
          <div className="space-y-6">
            <a
              href="/tagihanwarga"
              className="flex items-center justify-between px-6 py-4 rounded-lg bg-white text-amber-800 shadow-md hover:bg-amber-300 hover:text-amber-800 transition duration-300"
            >
              <div className="flex items-center">
                <FiFileText className="text-2xl mr-4" />
                <span className="font-semibold">Lihat Tagihan</span>
              </div>
              <span className="text-amber-800 group-hover:text-amber-800">
                →
              </span>
            </a>
            <a
              href="/aduanpelanggan"
              className="flex items-center justify-between px-6 py-4 rounded-lg bg-white text-amber-800 shadow-md hover:bg-amber-300 hover:text-amber-800 transition duration-300"
            >
              <div className="flex items-center">
                <FiAlertCircle className="text-2xl mr-4" />
                <span className="font-semibold">Buat Aduan</span>
              </div>
              <span className="text-amber-800 group-hover:text-amber-800">
                →
              </span>
            </a>
            <a
              href="/searchpengaduan"
              className="flex items-center justify-between px-6 py-4 rounded-lg bg-white text-amber-800 shadow-md hover:bg-amber-300 hover:text-amber-800 transition duration-300"
            >
              <div className="flex items-center">
                <FiSearch className="text-2xl mr-4" />
                <span className="font-semibold">Monitoring Aduan</span>
              </div>
              <span className="text-amber-800 group-hover:text-amber-800">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm">
        <p>
          © 2024 <span className="font-bold">KKNT Desa Lerep</span>. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
