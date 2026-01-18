"use client"

import { Control, Controller } from "react-hook-form"

type InterestGroupProps = {
  title: string
  name: string
  items: string[]
  control: Control<any>
  error?: string
}

export function InterestGroup({
  title,
  name,
  items,
  control,
  error,
}: InterestGroupProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = field.value || []

          function toggleItem(item: string) {
            if (selectedValues.includes(item)) {
              field.onChange(
                selectedValues.filter(value => value !== item)
              )
            } else {
              field.onChange([...selectedValues, item])
            }
          }

          return (
            <>
              <div className="flex flex-wrap gap-2">
                {items.map(item => {
                  const isSelected = selectedValues.includes(item)

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleItem(item)}
                      className={`rounded-full border px-3 py-1 text-xs transition
                        ${
                          isSelected
                            ? "border-[#5B86A8] bg-[#E7EFF5] text-[#4F83A6]"
                            : "border-gray-300 text-gray-600 hover:border-[#5B86A8]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              {error && (
                <p className="mt-1 text-xs text-red-500">
                  {error}
                </p>
              )}
            </>
          )
        }}
      />
    </div>
  )
}
