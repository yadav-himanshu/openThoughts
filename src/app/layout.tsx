import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "OpenThoughts",
  description: "Share your thoughts with the world",
};

export default function RootLayout( { children }: { children: ReactNode } ) {
  return (
    <html lang="hi">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
