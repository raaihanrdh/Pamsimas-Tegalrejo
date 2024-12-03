"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../common/api";
import { getAuth, withAuth } from "../utils/routerAuth";

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({
    nama: "",
    username: "",
    password: "",
    permissions: {
      pelanggan: { create: 0, read: 0, update: 0, delete: 0 },
      tagihan: { create: 0, read: 0, update: 0, delete: 0 },
      pengaduan: { create: 0, read: 0, update: 0, delete: 0 },
      akun: { create: 0, read: 0, update: 0, delete: 0 },
      ambang: { create: 0, read: 0, update: 0, delete: 0 },
    },
  });

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/akun`);
      setAccounts(response.data.data);
    } catch (error) {
      alert("Gagal memuat akun: " + error.message);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/akun`, currentAccount);
      fetchAccounts();
      setIsAddModalOpen(false);
      resetCurrentAccount();
    } catch (error) {
      alert("Gagal menambahkan akun: " + error.message);
    }
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    console.log(currentAccount);
    try {
      const update = await axios.put(
        `${API_URL}/akun/${currentAccount.username}/detail`,
        currentAccount
      );
      if (update.status === 200) {
        fetchAccounts();
        setIsEditModalOpen(false);
        resetCurrentAccount();
      }
    } catch (error) {
      alert("Gagal memperbarui akun: " + error.message);
    }
  };

  const handleDeleteAccount = async (username) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;

    try {
      await axios.delete(`${API_URL}/akun/${username}`);
      fetchAccounts();
    } catch (error) {
      alert("Gagal menghapus akun: " + error.message);
    }
  };

  const resetCurrentAccount = () => {
    setCurrentAccount({
      nama: "",
      username: "",
      password: "",
      permissions: {
        pelanggan: { create: 0, read: 0, update: 0, delete: 0 },
        tagihan: { create: 0, read: 0, update: 0, delete: 0 },
        pengaduan: { create: 0, read: 0, update: 0, delete: 0 },
        akun: { create: 0, read: 0, update: 0, delete: 0 },
        ambang: { create: 0, read: 0, update: 0, delete: 0 },
      },
    });
  };

  const openEditModal = (account) => {
    setCurrentAccount(account);
    setIsEditModalOpen(true);
  };

  const renderPermissions = (permissions) => {
    return Object.entries(permissions).map(([module, actions]) => (
      <div key={module} className="mb-2">
        <strong className="capitalize">{module}</strong>
        <div className="flex space-x-2">
          {Object.entries(actions).map(([action, value]) => (
            <span
              key={action}
              className={`px-2 py-1 rounded text-xs ${
                value === 1 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">
        Manajemen Akun Admin
      </h2>
      <div className="bg-white shadow-xl rounded-lg p-5">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          {user.permissions.akun.create === 1 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all ease-in-out duration-300"
            >
              + Tambah Akun
            </button>
          )}
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-amber-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID Akun</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Permissions</th>
                {(user.permissions.akun.update === 1 ||
                  user.permissions.akun.delete === 1) && (
                  <th className="px-6 py-3 text-left">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account._id}
                  className="border-b hover:bg-gray-50 transition-colors ease-in-out duration-200"
                >
                  <td className="px-6 py-4">{account.idAkun}</td>
                  <td className="px-6 py-4">{account.nama}</td>
                  <td className="px-6 py-4">{account.username}</td>
                  <td className="px-6 py-4">
                    {renderPermissions(account.permissions)}
                  </td>
                  {(user.permissions.akun.update === 1 ||
                    user.permissions.akun.delete === 1) && (
                    <td className="px-6 py-4 space-x-2">
                      {user.permissions.akun.update === 1 && (
                        <button
                          onClick={() => openEditModal(account)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all ease-in-out duration-200"
                        >
                          Edit
                        </button>
                      )}

                      {user.permissions.akun.delete === 1 && (
                        <button
                          onClick={() => handleDeleteAccount(account.username)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all ease-in-out duration-200"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Akun */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Tambah Akun Baru
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={currentAccount.nama}
                  onChange={(e) =>
                    setCurrentAccount({
                      ...currentAccount,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={currentAccount.username}
                  onChange={(e) =>
                    setCurrentAccount({
                      ...currentAccount,
                      username: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={currentAccount.password}
                  onChange={(e) =>
                    setCurrentAccount({
                      ...currentAccount,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-700">
                  Permissions
                </h4>
                {Object.keys(currentAccount.permissions).map((module) => (
                  <div key={module} className="mb-4">
                    <h5 className="capitalize font-medium text-gray-700 mb-1">
                      {module}
                    </h5>
                    <div className="flex space-x-4">
                      {["create", "read", "update", "delete"].map((action) => (
                        <label key={action} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              currentAccount.permissions[module][action] === 1
                            }
                            onChange={(e) => {
                              const newPermissions = {
                                ...currentAccount.permissions,
                              };
                              newPermissions[module][action] = e.target.checked
                                ? 1
                                : 0;
                              setCurrentAccount({
                                ...currentAccount,
                                permissions: newPermissions,
                              });
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {action}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all ease-in-out duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Akun */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Edit Akun
            </h3>
            <form onSubmit={handleUpdateAccount} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={currentAccount.nama}
                  onChange={(e) =>
                    setCurrentAccount({
                      ...currentAccount,
                      nama: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={currentAccount.username}
                  disabled
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password (Opsional)
                </label>
                <input
                  type="password"
                  value={currentAccount.password}
                  onChange={(e) =>
                    setCurrentAccount({
                      ...currentAccount,
                      password: e.target.value,
                    })
                  }
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-700">
                  Permissions
                </h4>
                {Object.keys(currentAccount.permissions).map((module) => (
                  <div key={module} className="mb-4">
                    <h5 className="capitalize font-medium text-gray-700 mb-1">
                      {module}
                    </h5>
                    <div className="flex space-x-4">
                      {["create", "read", "update", "delete"].map((action) => (
                        <label key={action} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              currentAccount.permissions[module][action] === 1
                            }
                            onChange={(e) => {
                              const newPermissions = {
                                ...currentAccount.permissions,
                              };
                              newPermissions[module][action] = e.target.checked
                                ? 1
                                : 0;
                              setCurrentAccount({
                                ...currentAccount,
                                permissions: newPermissions,
                              });
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {action}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all ease-in-out duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(AdminDashboard);
