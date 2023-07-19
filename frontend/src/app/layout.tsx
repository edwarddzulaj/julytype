import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/main.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
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
    <html lang={params.lang}>
      <head></head>
      <body>
        <Navbar websiteDetails={websiteDetails} />
        <main className="wrapper">{children}</main>
        <Footer footerContent={footerContent} />
      </body>
    </html>
  );
}
