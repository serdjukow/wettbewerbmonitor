import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Wettbewerb Monitor",
  description: "Wettbewerb Monitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
