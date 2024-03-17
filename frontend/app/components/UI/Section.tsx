export default function Section({
  children,
  title = "",
  noIndent = false,
}: {
  children: any;
  title?: string;
  noIndent?: boolean;
}) {
  const hasTwoChilren = children.length === 2;
  return (
    <section className={`main-section${noIndent ? " no-indent" : ""}`}>
      {noIndent && <h3>{title}</h3>}
      {!noIndent && !hasTwoChilren && <h4>{title}</h4>}
      {hasTwoChilren && children[0]}
      <div className={`section-wrapper${!title ? " no-title" : ""}`}>
        {!hasTwoChilren && <section>{children}</section>}
        {hasTwoChilren && children[1]}
      </div>
    </section>
  );
}
