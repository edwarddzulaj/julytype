import { fetchAPI } from "@/app/utils/fetch-api";
import { SimplePage } from "@/@types/contentTypes";
import { PageSection } from "../../@types/components";
import Markdown from "react-markdown";

import Custom404 from "../404";
import SuccessPage from "../success";
import Section from "../components/UI/Section";
import DownloadTrialFonts from "../components/SimplePage/DownloadTrialFonts/DownloadTrialFonts";

const downloadString = "```download-typefaces-component```";

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

  return (
    <section className="container page">
      <h2>{title}</h2>
      <section className="sections">
        {sections.map((section: PageSection) => {
          let hasDownloadComponent = false;

          if (section.content.includes(downloadString)) {
            hasDownloadComponent = true;
            section.content = section.content.replace(downloadString, "");
          }

          return (
            <>
              <h3>{section.title}</h3>
              <Section title={""} key={section.id}>
                {/* eslint-disable-next-line react/no-children-prop */}
                <Markdown>{section.content}</Markdown>
                {hasDownloadComponent && <DownloadTrialFonts />}
              </Section>
            </>
          );
        })}
      </section>
    </section>
  );
}
