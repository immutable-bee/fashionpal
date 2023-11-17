/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_APPLICATION_CREDENTIALS: "./google-cloud-key.json",
  },
  images: {
    domains: [
      "afmipzwmfcoduhcmwowr.supabase.co",
      "jhkrtmranrjztkixgfgf.supabase.co",
    ],
  },
};

module.exports = nextConfig;
