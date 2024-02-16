import { Typeface, Style } from "@/@types/contentTypes";
import { fetchAPI } from "@/app/utils/fetch-api";
import { getStrapiMedia } from "@/app/utils/api-helpers";

import BuyButton from "@/app/components/UI/BuyButton";
import ChooseScript from "@/app/components/Typeface/ChooseScript";
import ChooseWeight from "@/app/components/Typeface/ChooseWeight";
import GlyphMap from "@/app/components/Typeface/GlyphMap";
import Markdown from "react-markdown";
import OpentypeFeaturesPreview from "@/app/components/Typeface/OpentypeFeaturesPreview/OpentypeFeaturesPreview";
import PDFPreview from "@/app/components/Typeface/PDFPreview";
import PurchaseSectionWrapper from "@/app/components/Cart/PurchaseSection/PurchaseSectionWrapper";
import Section from "@/app/components/UI/Section";
import { ScriptChoiceProvider, SelectedStyleProvider } from "@/app/providers";
import SupportedLanguages from "@/app/components/Typeface/SupportedLanguages";
import StylesSelector from "@/app/components/Typeface/StylesSelector";
import StyleWeights from "@/app/components/Typeface/StyleWeights";

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
      specimen: { populate: "*" },
      variableFont: { populate: "*" },
      glyphMap: { populate: "*" },
    },
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);
  return responseData.data[0];
}

export default async function Typeface({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const typeface: Typeface = await getTypeface(slug);
  const typefaceTitle = typeface.attributes.title;
  const { specimen, aboutText, styles, supportedLanguages, glyphMap } = typeface.attributes;

  const styleSlug = styles.data[0].attributes.slug;
  const style: Style | undefined = typeface.attributes.styles.data.find(
    (style) => style.attributes.slug === styleSlug
  );
  const { title, weights } = style?.attributes ?? { title: "", weights: [] };
  const regularWeight = weights.find((w) => w.title.toLowerCase().includes("regular"));
  const opentypeFeaturesFontTitle = `${title.trim()} ${regularWeight?.title.trim()}`;

  return (
    <ScriptChoiceProvider>
      <SelectedStyleProvider>
        <section className="container typeface">
          <article className={`quick-buttons ${styles.data.length > 1 ? "with-background" : ""}`}>
            {styles.data.length > 1 && <StylesSelector styles={styles.data} />}
            <div className="action-buttons">
              <BuyButton>{`Buy ${typefaceTitle}`}</BuyButton>
            </div>
          </article>
          <Section>
            <article className="fixed-controls">
              <ChooseScript />
              <ChooseWeight styles={styles.data} />
            </article>
            <StyleWeights styles={styles.data} />
          </Section>
          {specimen?.data?.attributes?.url && (
            <Section title="Specimen">
              <section className="download">
                <PDFPreview url={getStrapiMedia(specimen.data.attributes.url)} />
              </section>
            </Section>
          )}
          <Section title={`About ${typefaceTitle}`}>
            <div className="about-section">
              {/* eslint-disable-next-line react/no-children-prop */}
              <Markdown children={aboutText} className="markdown-text" />
            </div>
          </Section>
          <Section title={`Opentype features preview`}>
            <OpentypeFeaturesPreview fontFamilyTitle={opentypeFeaturesFontTitle} />
          </Section>
          {supportedLanguages && supportedLanguages.length > 0 && (
            <Section title={`Supported Languages`}>
              <SupportedLanguages languageData={supportedLanguages} />
            </Section>
          )}
          {glyphMap && glyphMap.length > 0 && (
            <Section title={`Glyphs`}>
              <GlyphMap
                glyphMap={glyphMap}
                fontFamilyTitle={opentypeFeaturesFontTitle}
                showAllButton={true}
              />
            </Section>
          )}
          <Section title={`Buy ${typefaceTitle}`} noIndent={true}>
            <PurchaseSectionWrapper typeface={typeface} />
          </Section>
        </section>
      </SelectedStyleProvider>
    </ScriptChoiceProvider>
  );
}
