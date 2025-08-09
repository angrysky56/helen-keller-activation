import '../public/styles.css';

import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helen Keller Activation Network",
  description: "A paradigm shift in AI memory architecture - where memories ARE the neural pathways",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
