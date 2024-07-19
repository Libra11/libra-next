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
  webpack(config){
    config.module.rules.push({
      test: /\.svg$/,
      use: [{loader: '@svgr/webpack', options: {icon: true}}]
    })
    return config
}
};

export default nextConfig;
