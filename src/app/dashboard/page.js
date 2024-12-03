"use client";
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  FiDroplet,
  FiBarChart,
  FiDollarSign,
  FiAlertCircle,
  FiUser,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { API_URL } from "../common/api";
import Link from "next/link";

// Mendaftarkan komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Page = () => {
  const [totalPelanggan, setTotalPelanggan] = useState(0);
  const [totalTagihan, setTotalTagihan] = useState(0);
  const [jumlahPengaduan, setJumlahPengaduan] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [totalTagihanBulanan, setTotalTagihanBulanan] = useState(null);
  const [pengaduanChartData, setPengaduanChartData] = useState(null);
  const router = useRouter(); // Use the useRouter hook

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();
        if (response.ok) {
          setDashboardData(data);
          // Total pelanggan
          const totalPelanggan = data.pelangganPerRTRW.reduce(
            (acc, curr) => acc + curr.jumlahPelanggan,
            0
          );
          setTotalPelanggan(totalPelanggan);
          setTotalTagihan(data.pemasukanBulanIni.totalTagihan);
          setJumlahPengaduan(
            data.pengaduanPerBulan.reduce(
              (acc, curr) => acc + curr.jumlahAduan,
              0
            )
          );
        } else {
          console.error("Error fetching data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const totalPelanggan = dashboardData.pelangganPerRTRW.reduce(
        (acc, curr) => acc + curr.jumlahPelanggan,
        0
      );
      setTotalPelanggan(totalPelanggan);
      setTotalTagihan(dashboardData.pemasukanBulanIni.totalTagihan);
      setJumlahPengaduan(
        dashboardData.pengaduanPerBulan.reduce(
          (acc, curr) => acc + curr.jumlahAduan,
          0
        )
      );
      const pelangganChartData = {
        labels: dashboardData.pelangganPerRTRW.map((item) => item._id),
        datasets: [
          {
            label: "Jumlah Pelanggan",
            data: dashboardData.pelangganPerRTRW.map(
              (item) => item.jumlahPelanggan
            ),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(pelangganChartData);

      // Set chart data pemasukan per bulan
      const totalTagihanBulanan = {
        labels: dashboardData.pemasukanPerBulan.map((item) => item._id),
        datasets: [
          {
            label: "Total Pemasukan",
            data: dashboardData.pemasukanPerBulan.map(
              (item) => item.totalTagihan
            ),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
      setTotalTagihanBulanan(totalTagihanBulanan);

      // Set chart data pengaduan per bulan
      const pengaduanChartData = {
        labels: dashboardData.pengaduanPerBulan.map((item) => item._id),
        datasets: [
          {
            label: "Jumlah Pengaduan",
            data: dashboardData.pengaduanPerBulan.map(
              (item) => item.jumlahAduan
            ),
            fill: false,
            borderColor: "rgba(255, 99, 132, 1)",
            tension: 0.1,
          },
        ],
      };
      setPengaduanChartData(pengaduanChartData);
    }
  }, [dashboardData]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "GET",
      });

      if (response.ok) {
        Cookies.remove("user");
        router.push("/login"); // This will work now that router is properly initialized
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="md:hidden flex bg-white fitems-center text-amber-800 px-4 py-2 rounded-full hover:bg-400-600 transition border border-amber-800 duration-300 mb-6"
        >
          <FiLogOut className=" flex justify-cente mr-2" />
          Logout
        </button>
        <Link
          href="/akun"
          className="md:hidden flex bg-white fitems-center text-amber-800 px-4 py-2 rounded-full hover:bg-400-600 transition border border-amber-800 duration-300 mb-6"
        >
          <FiUsers className="pr-2" size={28} />
          Akun
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-amber-900 shadow-lg rounded-lg p-6 text-center flex items-center justify-between relative group hover:scale-105 transition-transform duration-200">
          <div>
            <h3 className="text-lg text-white font-semibold">
              Total Pelanggan
            </h3>
            <p className="text-3xl text-white font-bold">{totalPelanggan}</p>
          </div>

          {/* Bagian kanan: Ikon */}
          <FiUser className="text-7xl p-5 bg-white shadow-sm rounded-full text-teal-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Pendapatan Bulanan */}
        <div className="bg-green-300 shadow-lg rounded-lg p-6 text-center flex items-center justify-between relative group hover:scale-105 transition-transform duration-200">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Pendapatan Bulan Ini
            </h3>
            <p className="text-4xl font-bold text-white">
              Rp {totalTagihan.toLocaleString("id-ID")}
            </p>
          </div>

          <FiDollarSign className="text-7xl p-5 bg-white shadow-sm rounded-full text-green-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Jumlah Pengaduan */}
        <div className="bg-red-400 shadow-lg rounded-lg p-6 text-center flex items-center  justify-between relative group hover:scale-105 transition-transform duration-200">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Jumlah Pengaduan
            </h3>
            <p className="text-4xl font-bold text-white">{jumlahPengaduan}</p>
          </div>

          <FiAlertCircle className="text-7xl p-5 bg-white shadow-sm rounded-full text-red-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg h-80">
          <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
            Grafik Jumlah Pelanggan per RTRW
          </h3>
          {chartData && (
            <Bar data={chartData} options={chartOptions} height={300} />
          )}
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg h-80">
          <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
            Grafik Pemasukan per Bulan
          </h3>
          {totalTagihanBulanan && (
            <Bar
              data={totalTagihanBulanan}
              options={chartOptions}
              height={300}
            />
          )}
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg h-80">
          <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
            Grafik Jumlah Pengaduan per Bulan
          </h3>
          {pengaduanChartData && (
            <Line
              data={pengaduanChartData}
              options={chartOptions}
              height={300}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
