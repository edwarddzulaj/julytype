import Link from "next/link";
import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";

async function getTypefaces() {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      styles: { populate: "*" },
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
        const styles = typeface.attributes.styles.data;
        const numStyles = styles.length;
        const numWeights = styles.reduce(
          (prev: Number, curr: any) => prev + curr.attributes?.weights?.length,
          0
        );

        console.log(typeface.attributes.styles.data[0]);
        return (
          <Link href={`/typefaces/${typeface.attributes.slug}`} key={typeface.id}>
            <article>
              <h2>{typeface.attributes.title}</h2>
              <div className="typeface-details">
                <span>
                  {numStyles} {numStyles > 1 ? "styles" : "style"}
                </span>
                <br />
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
