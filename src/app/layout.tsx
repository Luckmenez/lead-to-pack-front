import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Lead 2 Pack",
  description: "Lead 2 Pack App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
