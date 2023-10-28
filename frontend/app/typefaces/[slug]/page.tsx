import Link from "next/link";
import Markdown from "react-markdown";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Style, Typeface } from "@/@types/contentTypes";
import { getStrapiMedia } from "@/app/utils/api-helpers";
import BackButton from "@/app/components/UI/BackButton";
import BuyButton from "@/app/components/UI/BuyButton";
import PurchaseSection from "@/app/components/Cart/PurchaseSection/PurchaseSection";
import Section from "@/app/components/UI/Section";
import Typetester from "@/app/components/Typeface/Typetester/Typetester";
import PDFPreview from "@/app/components/Typeface/PDFPreview";
import { FontsData } from "@/app/components/Typeface/Typetester/typetester-types";
import { TypefaceWeight } from "@/@types/components";
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
      specimen: { populate: "*" },
      trialFonts: { populate: "*" },
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
  const { title, slug, specimen, aboutText, styles, trialFonts } = typeface.attributes;

  const hasTrialFonts = trialFonts?.data?.length > 0;
  const typetesterFontsData = constructFontData(typeface);

  return (
    <section className="container typeface">
      <article className="quick-buttons">
        <BackButton>Back to Typefaces</BackButton>
        <div className="action-buttons">
          {/* {hasTrialFonts && <TrialFontsButton/>} */}
          <BuyButton>Buy {title}</BuyButton>
        </div>
      </article>
      <Section title="Overview">
        <article className="typeface-styles">
          {styles.data.map((style: Style) => (
            <Link href={`/typefaces/${slug}/${style?.attributes?.slug}`} key={style.id}>
              <TypefaceSample
                title={style?.attributes?.title}
                regularWeight={style?.attributes?.weights[0]}
              />
            </Link>
          ))}
        </article>
      </Section>
      <Section title="Specimen">
        <section className="typetesters">
          <Typetester
            fontsData={typetesterFontsData}
            typetesterLanguageGroup={[
              {
                id: 0,
                language: "English",
                sample: [{ id: 0, text: "July type is coming sooner than you think" }],
              },
            ]}
          />
        </section>
        {specimen?.data?.attributes?.url && (
          <section className="download">
            <PDFPreview url={getStrapiMedia(specimen.data.attributes.url)} />
          </section>
        )}
      </Section>
      <Section title="About">
        {/* eslint-disable-next-line react/no-children-prop */}
        <Markdown children={aboutText} />
      </Section>
      <Section title={`Buy ${title}`} noIndent={true}>
        <PurchaseSection typeface={typeface} />
      </Section>
    </section>
  );
}

const constructFontData = (typeface: Typeface) => {
  let typetesterFontsData: FontsData[] = [];

  const { title, styles } = typeface.attributes;

  styles.data.map((style: Style) => {
    style.attributes.weights.map((weight: TypefaceWeight) => {
      let testerStyleName = style.attributes.title.replace(title, "");
      testerStyleName = testerStyleName.length > 0 ? testerStyleName.trim() + " " : "";
      const fontLabel = `${testerStyleName}${weight.title.trim()}`;
      const fullFontTitle = `${title} ${fontLabel}`;
      const fontValue = btoa(fontLabel);
      typetesterFontsData.push({
        label: fontLabel,
        title: fullFontTitle,
        value: fontValue,
        fontPath: getStrapiMedia(weight.fontFile?.data?.attributes?.url),
      });
    });
  });

  return typetesterFontsData;
};
