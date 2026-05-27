"use client";

import {
  FilePdfIcon,
  FileTextIcon,
  ImageIcon,
  XIcon,
} from "@phosphor-icons/react";
import { PortfolioDropzone } from "@/components/Dropzone";

const MAX_PORTFOLIO = 5;

function getFileLabel(url: string) {
  const name = url.split("/").pop() ?? url;
  return name.replace(/^\d+-/, "");
}

function ExistingFileIcon({ url }: { url: string }) {
  const ext = url.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return <FilePdfIcon size={18} weight="fill" className="shrink-0 text-red-400" />;
  if (["png", "jpg", "jpeg"].includes(ext ?? ""))
    return <ImageIcon size={18} weight="regular" className="shrink-0 text-[#9CCB3B]" />;
  return <FileTextIcon size={18} weight="regular" className="shrink-0 text-gray-500" />;
}

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
              <ExistingFileIcon url={url} />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-800">
                {getFileLabel(url)}
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
