// lib/api.js
const ROOT_API = process.env.NEXT_PUBLIC_API;
const API_V = process.env.NEXT_PUBLIC_API_V;

export const API_URL = `${ROOT_API}/${API_V}`;
