import type { Metadata } from "next";
import {  Geist_Mono } from "next/font/google";
import "./globals.scss";
import AuthProvider from "./Components/AuthProvider/AuthProvider";
import Header from "./Components/Header/Header";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={geistMono.className}>
      <AuthProvider>
        <Header/>
        <div className="my-container">{children}</div>
      </AuthProvider>
      </body>
      </html>
  );
}
