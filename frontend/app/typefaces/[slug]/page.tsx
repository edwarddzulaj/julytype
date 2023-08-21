import Link from "next/link";
import Markdown from "react-markdown";
import Section from "@/app/components/UI/Section";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface, Style } from "@/@types/contentTypes";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";

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
      <BackButton>Back to Typefaces</BackButton>
      <BuyButton />
      <h1>{title}</h1>
      <Section title="">
        {styles.data.map((style: Style) => (
          <Link href={`/typefaces/${slug}/${style.attributes.slug}`} key={style.id}>
            <article>{style.attributes.title}</article>
          </Link>
        ))}
      </Section>
      <Section title="Specimen">
        include some specimen and typetesters here
        <Link href={getStrapiMedia(specimen.data.attributes.url)}>Download PDF Specimen ⬇</Link>
      </Section>
      <Section title="About">
        {/* eslint-disable-next-line react/no-children-prop */}
        <Markdown children={aboutText} />
      </Section>
      <Section title={`Buy ${title}`}>PurchaseSection</Section>
    </section>
  );
}
