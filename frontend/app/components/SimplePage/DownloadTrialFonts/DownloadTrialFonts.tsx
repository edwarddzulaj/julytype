"use client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { useState } from "react";

import Iconly, { icons } from "../../UI/Iconly";
import { ChooseTypefacesPopup } from "./ChooseTypefacesPopup";

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_ENV === "production"
    ? process.env.NEXT_PUBLIC_STRAPI_API_URL
    : process.env.NEXT_PUBLIC_STRAPI_API_URL_DEV;

export default function DownloadTrialFonts() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const downloadTrialFonts = (specificTypefaces: string[] = []) => {
    if (specificTypefaces.length === 0) setIsLoading(true);

    fetch("/free-trials/api?endpoint=trialFonts")
      .then((res) => res.json())
      .then((data) => {
        if (specificTypefaces.length > 0) {
          data = data.filter((tf: { id: number }) => specificTypefaces.includes(tf.id.toString()));
        }

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

  const handleChoosingFonts = () => {
    setShowPopup(true);
  };

  return (
    <div className="download-trial-fonts">
      {showPopup && (
        <ChooseTypefacesPopup
          isOpen={showPopup}
          closeModal={() => setShowPopup(false)}
          downloadTrialFonts={downloadTrialFonts}
        />
      )}
      <button className="download-all" onClick={() => downloadTrialFonts()}>
        {isLoading && <span>Aggregating typefaces...</span>}
        {!isLoading && (
          <>
            Download all typefaces <Iconly icon={icons.download} />
          </>
        )}
      </button>
      <button className="download-some" onClick={handleChoosingFonts}>
        Choose a typeface
      </button>
    </div>
  );
}
