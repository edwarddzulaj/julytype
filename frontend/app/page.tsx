import Link from "next/link";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";
import { allStylesAndWeights } from "./utils/text-helpers";
import { getStrapiMedia } from "./utils/api-helpers";
import TypefaceSample from "./components/Typeface/TypefaceSample";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: { populate: "*" },
      mainFont: { populate: "*" },
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  return responseData.data || [];
}

export default async function Page() {
  const typefaces = await getTypefaces();

  return (
    <section className="container typeface-preview">
      {typefaces.map((typeface: Typeface) => {
        const { title, slug, styles, mainFont } = typeface.attributes;
        const mainFontURL = getStrapiMedia(mainFont.data.attributes.url);
        const { numStyles, numWeights } = allStylesAndWeights(styles.data);

        return (
          <Link href={`/typefaces/${slug}`} key={typeface.id}>
            <article>
              <TypefaceSample title={title} fontURL={mainFontURL} />
              <div className="typeface-details">
                <span>
                  {numStyles} {numStyles > 1 ? "styles" : "style"}
                </span>
                <span>
                  {numWeights} {numWeights > 1 ? "weights" : "weight"}
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </section>
  );
}
