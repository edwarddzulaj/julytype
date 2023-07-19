import Link from "next/link";
import Section from "@/src/app/components/UI/Section";
import { TypefaceWeight } from "@/src/app/types/components";
import { Style } from "@/src/app/types/contentTypes";
import { getStrapiMedia } from "@/src/app/utils/api-helpers";
import { fetchAPI } from "@/src/app/utils/fetch-api";
import Typetester from "@/src/app/components/Typeface/Typetester";

async function getStyle(slug: string) {
  const path = `/styles`;
  const urlParamsObject = {
    populate: {
      weights: { populate: "*" },
    },
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);
  return responseData.data[0];
}

export default async function Style({ params }: { params: { styleSlug: string } }) {
  const style: Style = await getStyle(params.styleSlug);
  const { title, weights } = style.attributes;

  return (
    <section className="container">
      <h1>{title}</h1>
      <Section title="Overview">
        {weights.map((weight: TypefaceWeight) => (
          <article key={weight.id}>{weight.title}</article>
        ))}
        <section className="typetesters">
          {weights.map((weight: TypefaceWeight) => {
            const randomNumber = getRandomIndex(0, weight.typetesterText.length);
            const randomText = weight.typetesterText[randomNumber]?.text || undefined;
            return <Typetester key={weight.id} typetesterText={randomText} />;
          })}
        </section>
      </Section>

      <Section title={`Buy ${title}`}>PurchaseSection</Section>
    </section>
  );
}

function getRandomIndex(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
