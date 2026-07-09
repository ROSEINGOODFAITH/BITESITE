/** Generic accessible accordion built on <details>/<summary>. */
export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b border-laurel-900/10 py-3"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-laurel-900 [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-lg transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-2 text-sm leading-relaxed text-ink/75">{children}</div>
    </details>
  );
}
