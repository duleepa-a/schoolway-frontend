import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins} from "next/font/google";
import "./globals.css";
import Authprovider from "./AuthenticatorComp/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  title: "SchoolWay",
  description: "Smart school van management system",
  icons: {
    icon: "/logo/Logo_dark.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <Authprovider>
        <main>
          {children}
        </main>
        </Authprovider>
      </body>
    </html>
  );
}
