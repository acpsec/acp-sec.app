import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicit — surfaces double-invoked effects/renders in dev to catch impure code.
  reactStrictMode: true,

  // The SentryAgent profile + playground were removed (test artifact). Redirect
  // old inbound links (e.g. from X) to the homepage instead of 404ing. Both the
  // profile and the (never-shipped) playground sub-route land on /.
  async redirects() {
    return [
      { source: "/agents/sentryagent", destination: "/", permanent: true },
      { source: "/agents/sentryagent/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
