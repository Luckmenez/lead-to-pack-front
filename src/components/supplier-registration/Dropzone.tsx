"use client"

import { useDropzone } from "react-dropzone"
import { UploadSimpleIcon } from "@phosphor-icons/react"

type Props = {
  onChange: (files: File[]) => void
}

export function PortfolioDropzone({ onChange }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onChange,
    accept: {
      "application/pdf": [],
      "image/png": [],
      "image/jpeg": [],
    },
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        mt-2 flex cursor-pointer flex-col items-center justify-center
        rounded-lg border-2 border-dashed
        px-6 py-10 text-center transition
        ${
          isDragActive
            ? "border-[#9CCB3B] bg-[#F6FAED]"
            : "border-gray-300 bg-transparent"
        }
      `}
    >
      <input {...getInputProps()} />

      <UploadSimpleIcon
        size={32}
        weight="regular"
        className="mb-3 text-gray-400"
      />

      <p className="text-sm font-medium text-gray-600">
        Arraste arquivos aqui ou clique para selecionar
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Catálogos, certificações, apresentações
      </p>
    </div>
  )
}
