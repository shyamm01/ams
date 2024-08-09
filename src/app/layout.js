import { Inter } from "next/font/google";
import "./globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

import { Metadata } from "next";
import BoostrapClient from "@/components/BoostrapClient/BoostrapClient";

export const metadata = {
  title: {
    template: "%s | AMS Dashboard",
    default: "AMS Dashboard",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add Font Awesome CDN link here */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
        <BoostrapClient />
      </body>
    </html>
  );
}