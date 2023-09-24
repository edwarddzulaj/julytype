import Section from "@/app/components/UI/Section";
import { TypefaceWeight } from "@/@types/components";
import { Typeface, Style } from "@/@types/contentTypes";
import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "@/app/utils/api-helpers";

import Typetester from "@/app/components/Typeface/Typetester";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";
import SupportedLanguages from "@/app/components/UI/SupportedLanguages";
import { indexAllSamples, getRandomIndex } from "../helpers";
import TypefaceSample from "@/app/components/Typeface/TypefaceSample";

async function getTypeface(slug: string) {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: {
        populate: {
          weights: {
            populate: {
              typetesterLanguageGroup: { populate: "*" },
              fontFile: { populate: "*" },
            },
          },
        },
      },
      supportedLanguages: { populate: "*" },
    },
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);
  return responseData.data[0];
}

export default async function Style({ params }: { params: { slug: string; styleSlug: string } }) {
  const { slug, styleSlug } = params;
  const typeface: Typeface = await getTypeface(slug);
  const style: Style | undefined = typeface.attributes.styles.data.find(
    (style) => style.attributes.slug === styleSlug
  );

  const { title, weights } = style?.attributes ?? { title: "", weights: [] };
  const typefaceTitle = typeface.attributes.title;
  const { supportedLanguages } = typeface.attributes;

  return (
    <section className="container style">
      <article className="quick-buttons">
        <BackButton backLink={`/typefaces/${typeface.attributes.slug}`}>
          Back to {typefaceTitle}
        </BackButton>
        <BuyButton />
      </article>
      <Section title={title}>
        <article className="styles-weights">
          {weights.map((weight: TypefaceWeight) => (
            <TypefaceSample
              key={weight.id}
              title={weight.title}
              fontURL={getStrapiMedia(weight.fontFile?.data?.attributes?.url)}
            />
          ))}
        </article>
        <section className="typetesters">
          {weights.map((weight: TypefaceWeight) => {
            const { allSamplesLatin, allSamplesCyrillic } = indexAllSamples(
              weight.typetesterLanguageGroup
            );
            const randomNumber = getRandomIndex(0, allSamplesLatin?.length);
            const randomText = allSamplesLatin[randomNumber]?.text;
            const typetesterData = {
              name: weight.title,
              fontPath: getStrapiMedia(weight.fontFile?.data?.attributes?.url),
            };

            return (
              <Typetester
                key={weight.id}
                typetesterText={randomText}
                fontsData={[typetesterData]}
              />
            );
          })}
        </section>
      </Section>
      {supportedLanguages && (
        <Section title={`Supported Languages`}>
          <SupportedLanguages languageData={supportedLanguages} />
        </Section>
      )}
      <Section title={`Buy ${typefaceTitle}`} noIndent={true}>
        <PurchaseSection typeface={typeface} />
      </Section>
    </section>
  );
}
