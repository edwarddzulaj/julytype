export default function Section({
  children,
  title = "",
  noIndent = false,
}: {
  children: any;
  title?: string;
  noIndent?: boolean;
}) {
  return (
    <section className={`main-section${noIndent ? " no-indent" : ""}`}>
      {noIndent && <h2>{title}</h2>}
      {!noIndent && <h4>{title}</h4>}
      <div className={`section-wrapper${!title ? " no-title" : ""}`}>
        <section>{children}</section>
      </div>
    </section>
  );
}
