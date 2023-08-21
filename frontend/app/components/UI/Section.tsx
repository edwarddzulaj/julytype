export default function Section({ children, title = "" }: { children: any; title: string }) {
  return (
    <section className="main-section">
      <h4>{title}</h4>
      <section>{children}</section>
    </section>
  );
}
