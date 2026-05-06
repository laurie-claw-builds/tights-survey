import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Backalast Turnout Tights Survey | PBT',
  description: 'PBT fit-testing survey for Backalast Turnout Tights',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F5F7F8]">{children}</body>
    </html>
  );
}
