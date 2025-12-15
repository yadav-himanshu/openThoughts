import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ReactNode } from "react";

export const metadata = {
  title: "OpenThoughts",
  description: "Share your thoughts with the world",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <ThemeToggle />
        <Footer />
      </body>
    </html>
  );
}
