import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // import component Footer

export const metadata = {
  title: 'GameGuide',
  description: 'Hướng dẫn game chuyên nghiệp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-950 text-white flex flex-col min-h-screen">
        {/* Navbar luôn xuất hiện */}
        <Navbar />

        {/* Nội dung page */}
        <main className="flex-1">{children}</main>

        {/* Footer luôn xuất hiện */}
        <Footer />
      </body>
    </html>
  );
}
