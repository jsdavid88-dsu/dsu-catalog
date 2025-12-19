import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    // SSR enabled for Vercel deployment
};

export default withNextIntl(nextConfig);

