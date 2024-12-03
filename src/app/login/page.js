"use client";
import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ROOT_API = process.env.NEXT_PUBLIC_API;
  const API_V = process.env.NEXT_PUBLIC_API_V;
  useEffect(() => {
    const user = Cookie.get("user");
    if (user) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setErrorMessage("Username and password cannot be empty.");
      setIsLoading(false);
      return;
    }

    if (trimmedUsername.length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const data = { username: trimmedUsername, password: trimmedPassword };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await axios.post(
        `${ROOT_API}/${API_V}`,
        JSON.stringify(data),
        config
      );
      const result = response.data;

      if (response.status === 200) {
        // More secure cookie setting
        Cookie.set("user", JSON.stringify(result.message), {
          expires: 1,
          secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
          sameSite: "strict", // Protects against CSRF
        });
        window.location.href = "/dashboard";
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message ||
            "A server error occurred. Please try again later."
        );
      } else {
        setErrorMessage("A server error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-amber-300  to-amber-800">
      {/* Left Side - Mobile Hidden */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="text-center">
          <img
            src="/logo.svg"
            alt="PAMSIMAS Logo"
            className="mx-auto w-3/4 mb-6 animate-float"
          />
          <h1 className="text-4xl font-bold text-amber-100 mb-2">
            PAMSIMAS TEGALREJO
          </h1>
          <p className="text-white text-md max-w-md mx-auto">
            Empowering communities through efficient water management systems
          </p>
          <footer className="mt-12 text-xs text-gray-300">
            <p>
              © 2024 <span className="font-bold">KKNT Desa Lerep</span>. All
              Rights Reserved.
            </p>
          </footer>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-amber-100 p-8 transform transition-all hover:scale-105 duration-300">
          <div className="md:hidden text-center mb-6">
            <img
              src="/logo.svg"
              alt="PAMSIMAS Logo"
              className="mx-auto h-24 w-24 mb-4"
            />
            <h1 className="text-2xl font-bold text-amber-800">PAMSIMAS</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-amber-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Sign in to continue to your dashboard
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 transition duration-300"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800 transition duration-300 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-amber-800"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800 focus:ring-opacity-50 transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
