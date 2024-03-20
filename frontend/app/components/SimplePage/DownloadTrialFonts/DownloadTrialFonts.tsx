"use client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStrapiMedia, getStrapiURL } from "@/app/utils/api-helpers";
import { retrieveTrialFonts, TrialFontObject } from "./helpers";

import Iconly, { icons } from "../../UI/Iconly";

export default function DownloadTrialFonts({ trialLicense }: any) {
  const [availableTrialFonts, setAvailableTrialFonts] = useState<TrialFontObject[]>([]);
  const [allFontsSelected, setAllFontsSelected] = useState(false);
  const [isLicenseAccepted, setIsLicenseAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTrialFonts = async () => {
    const fonts = await retrieveTrialFonts();

    setAvailableTrialFonts(fonts);
  };

  const handleFontSelection = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (!e) {
      const updatedFonts = availableTrialFonts.map((f) => ({ ...f, checked: !allFontsSelected }));

      setAvailableTrialFonts([...updatedFonts]);
      setAllFontsSelected(!allFontsSelected);
    } else {
      const fontId = +e.currentTarget.id;

      const font = availableTrialFonts?.find((f) => f.id === fontId);
      if (font) {
        font.checked = !font.checked;
        setAvailableTrialFonts([...availableTrialFonts]);
      }
    }
  };

  const downloadTrialFonts = async () => {
    const chosenFonts = availableTrialFonts.filter((f) => f.checked);
    if (!isLicenseAccepted || chosenFonts.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch("/free-trials/api?endpoint=trialFonts");
      let data = await response.json();
      data = data.filter((tf: { id: number }) => chosenFonts.find((f) => f.id === tf.id));

      const zip = new JSZip();

      for (const font of data) {
        for (const trialFont of font.trialFonts) {
          const { name, url } = trialFont.attributes;
          const response = await fetch(getStrapiURL(url));
          const data = await response.blob();
          zip.file(`${font.name}/${name}`, data);
        }
      }

      if (trialLicense) {
        const trialLicenseFile = await fetch(getStrapiMedia(trialLicense.url));
        const trialLicenseFileBlob = await trialLicenseFile.blob();
        zip.file("JulyType-Trial-License" + trialLicense.ext, trialLicenseFileBlob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "JulyType_Trial_Fonts.zip");
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrialFonts();
  }, []);

  return (
    <div className="download-trial-fonts">
      {availableTrialFonts && (
        <>
          <div className="checkboxes">
            {availableTrialFonts.length > 1 && (
              <div className="checkbox all-typefaces">
                <input
                  type="checkbox"
                  id="all"
                  onChange={() => {
                    handleFontSelection(null);
                  }}
                />
                <label htmlFor="all">All typefaces</label>
              </div>
            )}
            <ul>
              {availableTrialFonts.map((item: any) => (
                <li key={item.id} className="checkbox">
                  <input
                    type="checkbox"
                    id={item.id.toString()}
                    checked={item.checked}
                    onChange={(e) => handleFontSelection(e)}
                  />
                  <label htmlFor={item.id.toString()}> {item.name}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="checkbox license-agreement">
            <input
              type="checkbox"
              id="license-agreement"
              onChange={() => setIsLicenseAccepted(!isLicenseAccepted)}
            />
            <label htmlFor="license-agreement">
              I agree with <Link href="./licensing">Licensing terms</Link> in order to download the
              trial fonts
            </label>
          </div>
          <button className="download" onClick={downloadTrialFonts}>
            {isLoading && <span>Aggregating typefaces...</span>}
            {!isLoading && (
              <>
                Download <Iconly icon={icons.download} />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
