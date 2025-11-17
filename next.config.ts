// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// const nextConfig = {
//   // أي إعدادات Next.js الأخرى هنا
// };

// export default withNextIntl(
//     //nextConfig
//     {reactStrictMode: true,}
//     );

/** @type {import('next').NextConfig} */
const nextConfig = {
  //  build من اجل ان لا يقوم بالتحقق الصارم من الانواع خلال عملية ال 
  // 
  typescript: {
    ignoreBuildErrors: true,
  },
  // your config
};

module.exports = withNextIntl(nextConfig);