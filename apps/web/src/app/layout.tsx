import type { Metadata } from "next";
import { Bebas_Neue, Special_Elite, Chakra_Petch } from "next/font/google";
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas-neue',
  subsets: ['latin']
})

const specialElite = Special_Elite({
  weight: '400',
  variable: '--font-special-elite',
  subsets: ['latin']
})

const chakraPetch = Chakra_Petch({
  weight: '400',
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
        className={`${bebasNeue.variable} ${specialElite.variable} ${chakraPetch.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
