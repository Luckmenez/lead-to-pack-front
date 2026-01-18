export function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Etapa {step} de 3</span>
        <span>{step * 33}%</span>
      </div>
      <div className="h-1 w-full rounded bg-gray-200">
        <div
          className="h-1 rounded bg-[#9CCB3B]"
          style={{ width: `${step * 33}%` }}
        />
      </div>
    </div>
  )
}
