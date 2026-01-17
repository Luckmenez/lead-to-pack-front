"use client"

import { useDropzone } from "react-dropzone"
import { UploadSimpleIcon } from "@phosphor-icons/react"

type Props = {
  value?: File[]
  onChange: (files: File[]) => void
  error?: string
}

export function PortfolioDropzone({ value = [], onChange, error }: Props) {
  const hasFiles = value.length > 0

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "image/png": [],
      "image/jpeg": [],
    },
    maxSize: 10 * 1024 * 1024,
    onDropAccepted: files => {
      onChange([...files]) 
    },
  })

  const borderClass = error
    ? "border-red-500"
    : hasFiles
      ? "border-[#9CCB3B]"
      : "border-gray-300"

  const bgClass = isDragActive ? "bg-gray-50" : "bg-transparent"

  return (
    <div
      {...getRootProps()}
      className={`
        mt-2 flex cursor-pointer flex-col items-center justify-center
        rounded-lg border-2 border-dashed
        px-6 py-10 text-center transition
        ${borderClass} ${bgClass}
      `}
    >
      <input {...getInputProps()} />

      <UploadSimpleIcon
        size={32}
        weight="regular"
        className={`mb-3 ${hasFiles ? "text-[#9CCB3B]" : "text-gray-400"}`}
      />

      {hasFiles ? (
        <div className="flex w-full flex-col items-center gap-1">
          {value.map(file => (
            <div
              key={file.name}
              className="max-w-full truncate text-sm font-medium text-gray-700"
            >
            {file.name}
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-600">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <span className="mt-1 text-xs text-muted-foreground">
            Catálogos, certificações, apresentações
          </span>
        </>
      )}
    </div>
  )
}
