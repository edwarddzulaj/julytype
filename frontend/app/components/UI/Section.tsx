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
      <h3>{title}</h3>
      <div className={`section-wrapper${!title ? " no-title" : ""}`}>
        <section>{children}</section>
      </div>
    </section>
  );
}
