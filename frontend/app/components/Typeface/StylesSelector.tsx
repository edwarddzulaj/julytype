import { Style } from "@/@types/contentTypes";

export default function StylesSelector({ styles }: { styles: Style[] }) {
  return (
    <div className="styles-selector">
      <h6>Choose Optical style</h6>
      <ul className="styles">
        {styles.map((style) => (
          <li key={style.id}>{style.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
}
