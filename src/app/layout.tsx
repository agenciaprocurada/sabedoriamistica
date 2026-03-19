import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { StarryBackground } from "@/components/layout";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sabedoria Mística | Portal de Autoconhecimento",
  description:
    "Conecte-se com sua essência e descubra o caminho para a paz interior. Ferramentas de autoconhecimento e sabedoria ancestral para transformar sua vida.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let headerUser = null;
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      headerUser = {
        name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "",
        email: user.email ?? "",
      };
    }
  } catch {
    // Falha silenciosa — usuário aparece como deslogado
  }

  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen flex flex-col text-text-primary">
        <StarryBackground />
        <Header user={headerUser} />
        <main className="flex-1 relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
