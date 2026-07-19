"use client";

export type FolderTab = {
  id: string;
  label: string;
  accent: keyof typeof folderColor;
};

/*
 * Every pairing below clears 4.5:1. Sunset Lavender is deliberately absent —
 * ink on lavender measures 3.66:1, so it is never used behind a label.
 */
export const folderColor = {
  eminence: { bg: "bg-eminence", text: "text-maize" }, //  7.00:1
  iris: { bg: "bg-iris", text: "text-maize" },         //  9.24:1
  deep: { bg: "bg-deep", text: "text-maize" },         // 11.74:1
  fawn: { bg: "bg-fawn", text: "text-ink" },           //  9.14:1
  maize: { bg: "bg-maize", text: "text-ink" },         // 13.58:1
} as const;

/**
 * A manila folder. Tabs are rounded rectangles overlapping along one top edge.
 * Switching re-keys the panel so it remounts and replays `paper-drop` — the new
 * sheet is placed onto the stack rather than swapping in place. Two decorative
 * sheets sit beneath so there is visibly a stack to land on.
 */
export default function Folder({
  tabs,
  active,
  onSelect,
  children,
  labelledBy,
}: {
  tabs: FolderTab[];
  active: string;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  const body = folderColor[activeTab.accent];
  const interactive = tabs.length > 1 && onSelect;

  return (
    <div className="relative">
      <div className="flex items-end pl-3" role={interactive ? "tablist" : undefined}>
        {tabs.map((t, i) => {
          const isActive = t.id === active;
          const c = folderColor[t.accent];
          const shared =
            "font-display relative flex min-h-[44px] items-center rounded-t-xl border-2 border-b-0 border-ink px-5 text-[11px] font-bold tracking-wide whitespace-nowrap uppercase sm:text-xs";

          const style = {
            marginLeft: i === 0 ? 0 : "-10px",
            zIndex: isActive ? 40 : 10 + i,
            transform: isActive ? "translateY(0)" : "translateY(7px)",
          } as const;

          if (!interactive) {
            return (
              <span key={t.id} style={style} className={`${shared} ${c.bg} ${c.text}`}>
                {t.label}
              </span>
            );
          }

          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => onSelect(t.id)}
              style={style}
              className={`${shared} press-sm cursor-pointer transition-[transform,filter] duration-300 ease-out ${c.bg} ${c.text} ${
                isActive ? "" : "brightness-90 hover:-translate-y-0.5 hover:brightness-100"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* The stack the new sheet lands on. Decorative only. */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-y-2.5 rotate-[0.5deg] rounded-2xl border-2 border-ink/35 bg-iris/50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-y-1 -rotate-[0.3deg] rounded-2xl border-2 border-ink/50 bg-iris/75"
        />

        <div
          key={activeTab.id}
          id={`panel-${activeTab.id}`}
          role={interactive ? "tabpanel" : undefined}
          aria-labelledby={labelledBy}
          className={`paper-drop relative z-30 rounded-2xl rounded-tl-none border-2 border-ink p-4 shadow-hard sm:p-5 ${body.bg}`}
        >
          <div className="paper-content rounded-xl border-2 border-ink bg-maize p-6 text-ink sm:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
