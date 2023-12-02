import { TypefaceWeight } from "@/@types/components";
import { Typeface, Style } from "@/@types/contentTypes";
import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "@/app/utils/api-helpers";

import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import ChooseScript from "@/app/components/Typeface/ChooseScript";
import { FontsData } from "@/app/components/Typeface/Typetester/typetester-types";
import OpentypeFeaturesPreview from "@/app/components/Typeface/OpentypeFeaturesPreview/OpentypeFeaturesPreview";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";
import Section from "@/app/components/UI/Section";
import { ScriptChoiceProvider } from "@/app/providers";
import SupportedLanguages from "@/app/components/Typeface/SupportedLanguages";
import TypefaceSample from "@/app/components/Typeface/TypefaceSample";
import Typetester from "@/app/components/Typeface/Typetester/Typetester";

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

  const { title, weights, lineHeight } = style?.attributes ?? { title: "", weights: [] };
  const typefaceTitle = typeface.attributes.title;
  const { supportedLanguages } = typeface.attributes;

  const regularWeight = weights.find((w) => w.title.toLowerCase().includes("regular"));
  const opentypeFeaturesFontTitle = `${title.trim()} ${regularWeight?.title.trim()}`;

  return (
    <ScriptChoiceProvider>
      <section className="container style">
        <article className="quick-buttons">
          <BackButton backLink={`/typefaces/${typeface.attributes.slug}`}>
            Back to {typefaceTitle}
          </BackButton>
          <div className="action-buttons">
            <BuyButton>{`Buy ${title}`}</BuyButton>
          </div>
        </article>
        <ChooseScript />
        <Section title="Overview">
          <article className="styles-weights">
            {weights.map((weight: TypefaceWeight) => (
              <TypefaceSample
                key={weight.id}
                title={`${title} ${weight.title}`}
                regularWeight={weight}
              />
            ))}
          </article>
          <section className="typetesters">
            {weights.map((weight: TypefaceWeight) => {
              const fontLabel = `${title.trim()} ${weight.title.trim()}`;
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
                  defaultOptions={{ lineHeight: lineHeight }}
                />
              );
            })}
          </section>
        </Section>
        <Section title={`Opentype features preview`}>
          <OpentypeFeaturesPreview fontFamilyTitle={opentypeFeaturesFontTitle} />
        </Section>
        {supportedLanguages && supportedLanguages.length > 0 && (
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
