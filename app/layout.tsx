import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DailyBet | Every match. Every moment.',
  description: 'Explore sports, fixtures and markets on DailyBet.',
  applicationName: 'DailyBet',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/images/dailybet-icon.svg' },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'DailyBet' },
};
export const viewport: Viewport = { themeColor: '#071B49', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
