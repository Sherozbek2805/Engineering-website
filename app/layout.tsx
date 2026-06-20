import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import BackgroundGradient from "@/components/ui/background-gradient";

export const metadata: Metadata = {
  title: "BuildNet — What are you building right now?",
  description: "A platform for engineering students to showcase projects, find teammates, and discover opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <BackgroundGradient />
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
