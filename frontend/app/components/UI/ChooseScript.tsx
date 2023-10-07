"use client";

export default function ChooseScript({
  handleChangeScript = () => {},
}: {
  handleChangeScript: (payload: any) => void;
}) {
  return (
    <>
      <div>Choose script</div>
      <div>
        <button onClick={() => handleChangeScript("latin")}>Latin</button>
        <button>Cyrillic</button>
      </div>
    </>
  );
}
