import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/reset.css";
import "@/styles/main.css";
import { ThemeChangeProvider } from "./providers/index";
import { fetchAPI } from "./utils/fetch-api";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Custom404 from "./[simplePageSlug]/404";

const FALLBACK_SEO = {
  title: "JulyType",
  description: "Type Foundry: JulyType",
};

async function getSettings(): Promise<any> {
  const path = `/setting`;

  const urlParamsObject = {
    populate: {
      websiteDetails: { populate: "*" },
      footerContent: { populate: "*" },
    },
  };

  const response = await fetchAPI(path, urlParamsObject);
  return response;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  if (!settings.data) return FALLBACK_SEO;
  const { websiteDetails } = settings.data.attributes;

  return {
    title: websiteDetails.title,
    description: websiteDetails.description,
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    },
    manifest: "/site.webmanifest",
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#FCFCFC" },
      { media: "(prefers-color-scheme: dark)", color: "#191919" },
    ],
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const settings = await getSettings();

  if (!settings.data) return Custom404();

  const { websiteDetails, footerContent } = settings.data.attributes;

  return (
    <html lang="en" suppressHydrationWarning>
      <head />

      <body>
        <ThemeChangeProvider>
          <Navbar websiteDetails={websiteDetails} />
          <main className="wrapper">{children}</main>
          <Footer footerContent={footerContent} />
        </ThemeChangeProvider>
        <Analytics />
      </body>
    </html>
  );
}
