"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadSimpleIcon, XIcon, FilePdfIcon } from "@phosphor-icons/react";

const MAX_FILES = 5;

type Props = {
  value?: File[];
  onChange: (files: File[]) => void;
  error?: string;
};

export function PortfolioDropzone({ value = [], onChange, error }: Props) {
  const remaining = MAX_FILES - value.length;

  const onDrop = useCallback(
    (accepted: File[]) => {
      const toAdd = accepted.slice(0, remaining);
      onChange([...value, ...toAdd]);
    },
    [value, remaining, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "image/png": [],
      "image/jpeg": [],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: remaining === 0,
    onDrop,
  });

  const removeFile = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  const borderClass = error
    ? "border-red-500"
    : value.length > 0
      ? "border-[#9CCB3B]"
      : "border-gray-300";

  const bgClass = isDragActive ? "bg-gray-50" : "bg-transparent";

  return (
    <div className="mt-2 space-y-3">
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, i) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                {isImage && previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-red-50">
                    <FilePdfIcon
                      size={22}
                      weight="fill"
                      className="text-red-500"
                    />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Remover arquivo"
                >
                  <XIcon size={16} weight="bold" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {remaining > 0 && (
        <div
          {...getRootProps()}
          className={`
            flex cursor-pointer flex-col items-center justify-center
            rounded-lg border-2 border-dashed
            px-6 py-8 text-center transition
            ${borderClass} ${bgClass}
          `}
        >
          <input {...getInputProps()} />

          <UploadSimpleIcon
            size={28}
            weight="regular"
            className="mb-2 text-gray-400"
          />

          <p className="text-sm font-medium text-gray-600">
            {isDragActive
              ? "Solte os arquivos aqui"
              : "Arraste arquivos ou clique para selecionar"}
          </p>
          <span className="mt-1 text-xs text-muted-foreground">
            PDF, JPG ou PNG — máx. 10 MB cada
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length > 0
            ? `${value.length}/${MAX_FILES} arquivo${value.length > 1 ? "s" : ""} selecionado${value.length > 1 ? "s" : ""}`
            : `Máximo ${MAX_FILES} arquivos`}
        </span>
        {remaining === 0 && (
          <span className="font-medium text-[#9CCB3B]">Limite atingido</span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
