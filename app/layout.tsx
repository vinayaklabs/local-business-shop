import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Business Shop",
  description: "Demo local business e-commerce app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <main className="container app-main">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
