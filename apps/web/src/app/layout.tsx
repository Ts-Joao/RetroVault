import type { Metadata } from "next";
import NavBar from "@/components/layout/nav-bar/NavBar";
import Footer from "@/components/layout/footer/Footer";
import { Barlow_Condensed, Special_Elite, Chakra_Petch } from "next/font/google";
import './globals.css';

const barlowCondensed = Barlow_Condensed({
  weight: '400',
  variable: '--font-barlow-condensed',
  subsets: ['latin']
})

const specialElite = Special_Elite({
  weight: '400',
  variable: '--font-special-elite',
  subsets: ['latin']
})

const chakraPetch = Chakra_Petch({
  weight: ['300', '400'],
  variable: '--font-chakra-petch',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "RetroVault",
  description: "Seu e-commerce de mídia física retrô favorito!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${barlowCondensed.variable} ${specialElite.variable} ${chakraPetch.variable} antialiased flex flex-col min-h-dvh gap-5`}
      >
      <NavBar />
        <main className="flex flex-col flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
