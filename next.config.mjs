/*
 * @Author: Libra
 * @Date: 2024-05-22 15:43:28
 * @LastEditors: Libra
 * @Description: 
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    API_KEY: process.env.API_KEY,
  },
};

export default nextConfig;
