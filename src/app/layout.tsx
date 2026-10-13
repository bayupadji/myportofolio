import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Lightbox } from "@/presentation/components/ui/Lightbox";
import { QueryProvider } from "@/presentation/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Bayu · Generalist Product Designer (UI/UX)",
  description:
    "Personal portfolio of Bayu, a generalist Product Designer crafting high-impact digital experiences across web, mobile, and complex systems.",
  authors: [{ name: "Bayu" }],
  keywords: [
    "Product Designer",
    "UI/UX Designer",
    "Design Systems",
    "Fintech UX",
    "Admin Tools",
    "B2B SaaS",
    "Figma",
    "Interaction Design",
  ],
  openGraph: {
    title: "Bayu · Generalist Product Designer (UI/UX)",
    description:
      "Designing intuitive, high-impact digital experiences across web, mobile, and complex systems.",
    type: "website",
    locale: "en_US",
    siteName: "Bayu Design Portfolio",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D12" },
  ],
};

const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme-preference');
    var isDark = false;
    if (saved === 'dark') {
      isDark = true;
    } else if (saved === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased selection:bg-[var(--accent)] selection:text-[var(--accent-contrast)]">
        <QueryProvider>
          {children}
          <Lightbox />
        </QueryProvider>
      </body>
    </html>
  );
}
