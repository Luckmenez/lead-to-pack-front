"use client";

import { XIcon } from "@phosphor-icons/react";
import { PortfolioDropzone } from "@/components/Dropzone";
import {
  getPortfolioFileLabel,
  PortfolioFileIcon,
} from "@/components/portfolio/PortfolioFileDisplay";

const MAX_PORTFOLIO = 5;

type Props = {
  keptUrls: string[];
  newFiles: File[];
  onRemoveExisting: (url: string) => void;
  onNewFilesChange: (files: File[]) => void;
  color?: "green" | "blue";
  error?: string;
};

export function PortfolioEditor({
  keptUrls,
  newFiles,
  onRemoveExisting,
  onNewFilesChange,
  color = "green",
  error,
}: Props) {
  const total = keptUrls.length + newFiles.length;
  const canAddMore = total < MAX_PORTFOLIO;

  return (
    <div className="space-y-3">
      {keptUrls.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keptUrls.map((url) => (
            <li
              key={url}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
                color === "green"
                  ? "border-[#9CCB3B]/40"
                  : "border-[#4F83A6]/30"
              }`}
            >
              <PortfolioFileIcon url={url} />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                {getPortfolioFileLabel(url)}
              </span>
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Remover arquivo"
              >
                <XIcon size={14} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {canAddMore && (
        <PortfolioDropzone
          value={newFiles}
          onChange={onNewFilesChange}
          existingCount={keptUrls.length}
        />
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {total > 0
            ? `${total}/${MAX_PORTFOLIO} arquivo${total !== 1 ? "s" : ""} no portfólio`
            : "Nenhum arquivo no portfólio"}
        </span>
        {total >= MAX_PORTFOLIO && (
          <span className="font-medium text-[#9CCB3B]">Limite atingido</span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
