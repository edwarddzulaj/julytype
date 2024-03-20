import Image from "next/image";
import { fetchAPI } from "../utils/fetch-api";
import { getStrapiMedia } from "../utils/api-helpers";
import { PageSection } from "@/@types/components";
import Section from "../components/UI/Section";
import Markdown from "react-markdown";

import DownloadTrialFonts from "../components/SimplePage/DownloadTrialFonts/DownloadTrialFonts";
const downloadString = "```download-typefaces-component```";

async function getSettings(): Promise<any> {
  const path = `/setting`;

  const urlParamsObject = {
    populate: {
      trialLicense: { populate: "*" },
    },
  };

  const response = await fetchAPI(path, urlParamsObject);
  return response;
}

export default async function FreeTrials(title: string, sections: any) {
  const settings = await getSettings();
  const { trialLicense } = settings.data.attributes;

  return (
    <section className="container page free-trials">
      <h1>{title}</h1>
      <section className="sections">
        {sections.map((section: PageSection) => {
          let hasDownloadComponent = false;

          if (section.content.includes(downloadString)) {
            hasDownloadComponent = true;
            section.content = section.content.replace(downloadString, "");
          }
          return (
            <Section title={section.title} key={section.id}>
              {/* eslint-disable-next-line react/no-children-prop */}
              <Markdown linkTarget="_blank" className="markdown-text">
                {section.content}
              </Markdown>
              {hasDownloadComponent && (
                <DownloadTrialFonts trialLicense={{ ...trialLicense.data.attributes }} />
              )}
            </Section>
          );
        })}
        <Section>
          <Image
            className="globus-image"
            src={getStrapiMedia("/assets/images/free-trials-globus.svg") as string}
            width={250}
            height={200}
            alt="Free trials globus"
          ></Image>
        </Section>
      </section>
    </section>
  );
}
