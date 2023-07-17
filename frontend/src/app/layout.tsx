import type { Metadata } from 'next';
import './globals.css';
import { getStrapiMedia, getStrapiURL } from './utils/api-helpers';
import { fetchAPI } from './utils/fetch-api';

import Footer from './components/Footer';
import Navbar from './components/Navbar';

const FALLBACK_SEO = {
  title: 'JulyType',
  description: 'Type Foundry: JulyType',
};

async function getSettings(): Promise<any> {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token)
    throw new Error('The Strapi API Token environment variable is not set.');

  const path = `/setting`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: [
      'websiteTitle.title',
      'footerDetails'
    ],
  };

  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    if (!settings.data) return FALLBACK_SEO;
    const { websiteTitle } = settings.data.attributes;

    return {
      'title': websiteTitle.title,
      'description': websiteTitle.description
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

    const { websiteTitle, footerDetails } = settings.data.attributes;

  return (
    <html lang={params.lang}>
      <body>
        <Navbar websiteTitle={websiteTitle}/>
        <main className="dark:bg-black dark:text-gray-100 min-h-screen">
          {children}
        </main>

        {/* <Footer
          logoText={footer.footerLogo.logoText}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories.data}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        /> */}
      </body>
    </html>
  );
}
