import { fetchAPI } from "@/app/utils/fetch-api";
import { SimplePage } from "@/@types/contentTypes";
import { PageSection } from "../../@types/components";
import Markdown from "react-markdown";

import About from "./about";
import Custom404 from "./404";
import FreeTrials from "./free-trials";
import SuccessPage from "./success";
import Section from "../components/UI/Section";

async function getPage(slug: string) {
  const path = `/simple-pages`;
  const urlParamsObject = {
    populate: "*",
    filters: {
      slug: slug,
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  return responseData.data[0];
}

export default async function SimplePage({
  params,
  searchParams,
}: {
  params: { simplePageSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page: SimplePage = await getPage(params.simplePageSlug);

  if (params.simplePageSlug === "success" && searchParams.session_id)
    return SuccessPage({ sessionId: searchParams.session_id as string | undefined });
  if (!page) return Custom404();

  const { title, sections } = page.attributes;
  if (params.simplePageSlug === "about") return About(title, sections);
  if (params.simplePageSlug === "free-trials") return FreeTrials(title, sections);

  return (
    <section className="container page">
      <h2>{title}</h2>
      <section className="sections">
        {sections.map((section: PageSection) => {
          return (
            <>
              <Section title={section.title} key={section.id}>
                {/* eslint-disable-next-line react/no-children-prop */}
                <Markdown>{section.content}</Markdown>
              </Section>
            </>
          );
        })}
      </section>
    </section>
  );
}
