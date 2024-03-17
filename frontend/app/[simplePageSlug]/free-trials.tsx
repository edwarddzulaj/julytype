import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";
import { PageSection } from "@/@types/components";
import Section from "../components/UI/Section";
import Markdown from "react-markdown";

import DownloadTrialFonts from "../components/SimplePage/DownloadTrialFonts/DownloadTrialFonts";
const downloadString = "```download-typefaces-component```";

export default function FreeTrials(title: string, sections: any) {
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
            <>
              <Section title={section.title} key={section.id}>
                <div>
                  {/* eslint-disable-next-line react/no-children-prop */}
                  <Markdown linkTarget="_blank" className="markdown-text">
                    {section.content}
                  </Markdown>
                  {hasDownloadComponent && <DownloadTrialFonts />}
                </div>
              </Section>
            </>
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
