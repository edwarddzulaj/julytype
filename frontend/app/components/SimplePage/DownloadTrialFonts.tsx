"use client";
import Iconly, { icons } from "../UI/Iconly";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";

const BASE_URL = "http://localhost:1337";

export default function DownloadTrialFonts() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadTrialFonts = () => {
    setIsLoading(true);

    fetch("/free-trials/api?endpoint=trialFonts")
      .then((res) => res.json())
      .then((data) => {
        const zip = new JSZip();
        const remoteZips = data.map(async (font: any) => {
          for (const [_, trialFont] of font.trialFonts.entries()) {
            const { name, url } = trialFont.attributes;

            const response = await fetch(BASE_URL + url);
            const data = await response.blob();
            zip.file(`${font.name}/${name}`, data);
          }

          return data;
        });

        Promise.all(remoteZips)
          .then(() => {
            setTimeout(() => {
              zip.generateAsync({ type: "blob" }).then((content) => {
                saveAs(content, "JulyType_Trial_Fonts.zip");
              });

              setIsLoading(false);
            }, 500);
          })
          .catch(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="download-trial-fonts">
      {isLoading && <span>Aggregating typefaces...</span>}
      <button onClick={downloadTrialFonts}>
        Download all typefaces <Iconly icon={icons.download} />
      </button>
      <button>choose a typeface</button>
    </div>
  );
}
