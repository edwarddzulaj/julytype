import Section from "@/app/components/UI/Section";
import { TypefaceWeight, TypetesterText, TypetesterTextGroup } from "@/@types/components";
import { Typeface, Style } from "@/@types/contentTypes";
import { fetchAPI } from "@/app/utils/fetch-api";
import Typetester from "@/app/components/Typeface/Typetester";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";

async function getTypeface(slug: string) {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: {
        populate: {
          weights: {
            populate: {
              typetesterLanguageGroup: { populate: "*" },
            },
          },
        },
      },
    },
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);
  return responseData.data[0];
}

export default async function Style({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const typeface: Typeface = await getTypeface(slug);
  const style: Style = typeface.attributes.styles.data[0];
  const { title, weights } = style.attributes;

  return (
    <section className="container style">
      <article className="quick-buttons">
        <BackButton>Back to {typeface.attributes.title}</BackButton>
        <BuyButton />
      </article>
      <Section title={title}>
        <article className="styles-weights">
          {weights.map((weight: TypefaceWeight) => (
            <h2 key={weight.id}>{weight.title}</h2>
          ))}
        </article>
        <section className="typetesters">
          {weights.map((weight: TypefaceWeight) => {
            const { allSamplesLatin, allSamplesCyrillic } = indexAllSamples(
              weight.typetesterLanguageGroup
            );
            const randomNumber = getRandomIndex(0, allSamplesLatin?.length);
            const randomText = allSamplesLatin[randomNumber]?.text;

            return (
              <Typetester
                key={weight.id}
                typetesterText={randomText}
                fontName={weight.title}
                fontPath={getStrapiMedia(weight.fontFile?.data?.attributes?.url)}
              />
            );
          })}
        </section>
      </Section>
      <Section title={`Buy ${typeface.attributes.title}`} noIndent={true}>
        <PurchaseSection typeface={typeface} />
      </Section>
    </section>
  );
}

function getRandomIndex(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function indexAllSamples(languages: any) {
  const allSamplesLatin: any = [];
  const allSamplesCyrillic: any = [];

  languages.map((lang: TypetesterTextGroup) => {
    const isCyrillic = lang.language.includes("Cyrillic");
    if (isCyrillic) {
      allSamplesCyrillic.push(...lang.sample);
    } else {
      allSamplesLatin.push(...lang.sample);
    }
  });

  return { allSamplesLatin, allSamplesCyrillic };
}
