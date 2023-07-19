export default function Section({
  children,
  title = '',
}: {
  children: any;
  title: string;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
