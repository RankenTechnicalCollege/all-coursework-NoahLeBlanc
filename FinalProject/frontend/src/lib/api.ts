// src/lib/api.ts

import axios from "axios";

// Create a reusable axios client with a base URL
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Base URL for your API
  withCredentials: true, // Enable credentials (cookies) to be sent with requests
});
