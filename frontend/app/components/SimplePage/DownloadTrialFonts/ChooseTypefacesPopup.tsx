import { ChangeEventHandler, useEffect, useState } from "react";
import Modal from "react-modal";
import Iconly, { icons } from "../../UI/Iconly";
import { retrieveTrialFonts } from "./helpers";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    margin: "auto",
    width: "90%",
    height: "fit-content",
    maxHeight: "80%",
    inset: "0",
    padding: "0",
    border: "none",
    backgroundColor: "transparent",
  },
};

Modal.setAppElement(".wrapper");

export function ChooseTypefacesPopup({
  isOpen,
  closeModal,
  downloadTrialFonts,
}: {
  isOpen: boolean;
  closeModal: any;
  downloadTrialFonts: any;
}) {
  const [availableTrialFonts, setAvailableTrialFonts] = useState<any>([]);
  const [chosenFontIDs, setChosenFontIDs] = useState<string[]>([]);

  useEffect(() => {
    getFonts();
  }, []);

  const getFonts = async () => {
    const fonts = await retrieveTrialFonts();

    setAvailableTrialFonts(Object.values(fonts));
  };

  const choseFont = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFonts = [...chosenFontIDs];
    const fontId = e.target.value;

    const font = updatedFonts.find((f) => f === fontId);
    if (!font) {
      updatedFonts.push(fontId);
    } else {
      updatedFonts.splice(updatedFonts.indexOf(fontId), 1);
    }

    setChosenFontIDs(updatedFonts);
  };

  const downloadSpecificFonts = () => {
    if (chosenFontIDs.length === 0) return;
    downloadTrialFonts(chosenFontIDs);
  };

  return (
    <Modal isOpen={isOpen} contentLabel="Choose typefaces to download Modal" style={customStyles}>
      <article className="choose-fonts-popup">
        <div className="header">
          <h6>Choose typefaces to download</h6>
          <div className="close-popup" onClick={closeModal}>
            <Iconly icon={icons.close}></Iconly>
          </div>
        </div>
        <ul className="available-fonts">
          {availableTrialFonts.map((font: { name: string; id: number }) => (
            <li key={font.id}>
              <input type="checkbox" id={font.id.toString()} value={font.id} onChange={choseFont} />
              <label htmlFor={font.id.toString()}> {font.name}</label>
            </li>
          ))}
        </ul>

        <div className="actions">
          <button className="download-all" onClick={downloadSpecificFonts}>
            Download .zip
          </button>
          <button className="download-later" onClick={closeModal}>
            Maybe later
          </button>
        </div>
      </article>
    </Modal>
  );
}
