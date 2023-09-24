import Link from "next/link";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";
import { allStylesAndWeights } from "./utils/text-helpers";
import TypefaceSample from "./components/Typeface/TypefaceSample";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: {
        populate: {
          weights: {
            populate: {
              fontFile: { populate: "*" },
            },
          },
        },
      },
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
        const { title, slug, styles } = typeface.attributes;
        let regular: TypefaceWeight | null = null;
        let hovered: TypefaceWeight | null = null;

        styles.data[0].attributes.weights.forEach((weight: TypefaceWeight) => {
          if (weight.title.toLowerCase().includes("regular")) regular = weight;
          if (weight.title.toLowerCase().includes("italic")) hovered = weight;
          if (weight.title.toLowerCase().includes("bold")) hovered = weight;
        });

        const { numStyles, numWeights } = allStylesAndWeights(styles.data);

        return (
          <Link href={`/typefaces/${slug}`} key={typeface.id}>
            <article>
              <TypefaceSample title={title} regularWeight={regular} hoverWeight={hovered} />
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
