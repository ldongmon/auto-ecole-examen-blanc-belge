/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Pas de sélecteur de langue au v0 : on atterrit en FR par défaut.
      // NL sera rempli en P3 (voir docs/ROADMAP.md).
      { source: "/", destination: "/fr", permanent: false },
    ];
  },
};

export default nextConfig;
