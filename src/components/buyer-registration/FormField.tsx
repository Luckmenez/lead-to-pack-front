import { Input } from "../ui/input"

type FormFieldProps = {
  label: string
  name: string
  placeholder?: string
  register: any
  error?: string
}

export function FormField({
  label,
  name,
  placeholder,
  register,
  error,
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
        {...register(name)}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
