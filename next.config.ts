import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit — surfaces double-invoked effects/renders in dev to catch impure code.
  reactStrictMode: true,
};

export default nextConfig;
