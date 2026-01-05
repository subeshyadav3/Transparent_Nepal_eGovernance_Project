import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transparent Nepal",
  description: "Transparent Nepal is a digital platform that allows citizens to easily track how public money is used in government development projects. It provides clear information on budget allocation, actual expenditure, project status, and contractor details in one place. Citizens can actively participate by giving feedback, upvoting or downvoting project progress, and reporting issues related to quality or delays. The platform also enables comparison of development progress within regions and at the national level. By increasing visibility and citizen engagement, Transparent Nepal strengthens transparency, contractor responsibility, and overall public accountability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
