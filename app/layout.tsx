import type { Metadata } from "next"
import { Bricolage_Grotesque, Fraunces, Instrument_Sans, Space_Grotesk } from "next/font/google"
import "./globals.css"

// The app chrome is Instrument Sans. The other three faces exist only to render the mood previews.
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" })
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap" })
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" })
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" })

export const metadata: Metadata = {
  title: "Afterform",
  description: "Explore alternate visual directions for a screen you already have. A screenshot-based prototype.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${fraunces.variable} ${bricolage.variable} ${space.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  )
}
