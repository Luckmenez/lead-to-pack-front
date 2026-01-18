import { Input } from "./input"

type FormFieldProps = {
  label: string
  name: string
  placeholder?: string
  register: any
  error?: string
  onChangeCustom?: (value: string) => string
}

export function FormField({
  label,
  name,
  placeholder,
  register,
  error,
  onChangeCustom,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label.includes("*") ? (
          <>
            {label.replace("*", "")}
            <span className="text-red-500">*</span>
          </>
        ) : (
          label
        )}
      </label>

      <Input
        placeholder={placeholder}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
        {...register(name, {
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChangeCustom) return e

            const masked = onChangeCustom(e.target.value)
            e.target.value = masked
            return e
          },
        })}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
