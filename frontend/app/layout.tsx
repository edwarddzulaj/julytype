import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/main.css";
import { Providers } from "./providers";
import { fetchAPI } from "./utils/fetch-api";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

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
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#FCFCFC" },
      { media: "(prefers-color-scheme: dark)", color: "#191919" },
    ],
    manifest: "/site.webmanifest",
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
  // TODO: CREATE A CUSTOM ERROR PAGE
  if (!settings.data) return null;

  const { websiteDetails, footerContent } = settings.data.attributes;

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head />

      <body>
        <Providers>
          <Navbar websiteDetails={websiteDetails} />
          <main className="wrapper">{children}</main>
          <Footer footerContent={footerContent} />
        </Providers>
      </body>
    </html>
  );
}
