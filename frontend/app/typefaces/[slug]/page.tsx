import Link from "next/link";
import Markdown from "react-markdown";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface, Style } from "@/@types/contentTypes";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";
import Section from "@/app/components/UI/Section";
import Iconly, { icons } from "@/app/components/UI/Iconly";

async function getTypeface(slug: string) {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: { populate: "*" },
      specimen: { populate: "*" },
    },
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);
  return responseData.data[0];
}

export default async function Typeface({ params }: { params: { slug: string } }) {
  const typeface: Typeface = await getTypeface(params.slug);
  const { title, slug, specimen, aboutText, styles } = typeface.attributes;

  return (
    <section className="container typeface">
      <article className="quick-buttons">
        <BackButton>Back to Typefaces</BackButton>
        <BuyButton />
      </article>
      <Section title="">
        <article className="typeface-styles">
          {styles.data.map((style: Style) => (
            <Link href={`/typefaces/${slug}/${style.attributes.slug}`} key={style.id}>
              <h1>{style.attributes.title}</h1>
            </Link>
          ))}
        </article>
      </Section>
      <Section title="Specimen">
        include some specimen and typetesters here
        <div className="download">
          <Link href={getStrapiMedia(specimen.data.attributes.url)}>
            Download PDF Specimen <Iconly icon={icons.download} />
          </Link>
        </div>
      </Section>
      <Section title="About">
        {/* eslint-disable-next-line react/no-children-prop */}
        <Markdown children={aboutText} />
      </Section>
      <Section title={`Buy ${title}`}>
        <PurchaseSection typeface={typeface} />
      </Section>
    </section>
  );
}
