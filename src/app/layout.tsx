import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'JustForms — Forms that feel effortless',
  description: 'Create beautiful forms, share a link, collect responses.',
  openGraph: {
    title: 'JustForms',
    description: 'Create beautiful forms in seconds.',
    url: 'https://getjustforms.vercel.app',
    siteName: 'JustForms',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
