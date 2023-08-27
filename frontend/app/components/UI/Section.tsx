export default function Section({
  children,
  title = "",
  noIndent = false,
}: {
  children: any;
  title: string;
  noIndent?: boolean;
}) {
  return (
    <section className={`main-section ${noIndent ? "no-indent" : ""}`}>
      <h4>{title}</h4>
      <section>{children}</section>
    </section>
  );
}
