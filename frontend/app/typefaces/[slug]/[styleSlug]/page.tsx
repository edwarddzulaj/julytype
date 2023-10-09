import Section from "@/app/components/UI/Section";
import { TypefaceWeight } from "@/@types/components";
import { Typeface, Style } from "@/@types/contentTypes";
import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "@/app/utils/api-helpers";

import Typetester from "@/app/components/Typeface/Typetester/Typetester";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";
import SupportedLanguages from "@/app/components/UI/SupportedLanguages";
import TypefaceSample from "@/app/components/Typeface/TypefaceSample";
import { FontsData } from "@/app/components/Typeface/Typetester/typetester-types";
import ChooseScript from "@/app/components/UI/ChooseScript";
import { ScriptChoiceProvider } from "@/app/providers";

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
    <ScriptChoiceProvider>
      <section className="container style">
        <article className="quick-buttons">
          <BackButton backLink={`/typefaces/${typeface.attributes.slug}`}>
            Back to {typefaceTitle}
          </BackButton>
          <BuyButton />
        </article>
        <Section>
          <ChooseScript />
          <article className="styles-weights">
            {weights.map((weight: TypefaceWeight) => (
              <TypefaceSample key={weight.id} title={weight.title} regularWeight={weight} />
            ))}
          </article>
          <section className="typetesters">
            {weights.map((weight: TypefaceWeight) => {
              const testerStyleName = style!.attributes.title.replace(
                typeface.attributes.title,
                ""
              );
              const fontLabel = `${testerStyleName.trim()} ${weight.title.trim()}`;
              const typetesterData: FontsData = {
                label: fontLabel,
                value: btoa(weight.title),
                fontPath: getStrapiMedia(weight.fontFile?.data?.attributes?.url),
              };

              return (
                <Typetester
                  key={weight.id}
                  fontsData={[typetesterData]}
                  typetesterLanguageGroup={weight.typetesterLanguageGroup}
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
    </ScriptChoiceProvider>
  );
}
