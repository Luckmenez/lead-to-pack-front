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
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
