import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows the dev server to serve _next/* assets (JS/CSS) when the site is
  // opened via the machine's LAN IP (e.g. from a phone on the same Wi-Fi)
  // instead of localhost. Without this, Next 15 blocks those requests and
  // the page renders as unstyled raw HTML.
  allowedDevOrigins: ["192.168.1.6"],
};

export default nextConfig;
