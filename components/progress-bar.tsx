'use client';

type Props = {
  total: number;
  done: number;
};

export function ProgressBar({ total, done }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const remaining = total - done;

  return (
    <div className="bg-surface border border-theme rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted">
          {done} de {total} hechos
        </span>
        <span className="text-sm font-semibold text-[#22C55E]">{pct}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-surface-hover overflow-hidden">
        <div
          className="h-full rounded-full bg-[#22C55E] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="text-xs text-muted mt-2">Faltan {remaining} por hacer.</p>
      )}
    </div>
  );
}
