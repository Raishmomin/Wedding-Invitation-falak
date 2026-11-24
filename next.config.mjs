/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Allow LAN devices (e.g. phone on 192.168.1.x) to load dev resources like HMR
  allowedDevOrigins: ["192.168.1.22"],
  // no Next.js badge over the invitation while previewing it
  devIndicators: false,
};

export default nextConfig;
