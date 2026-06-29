"use client";

import {
  FilePdfIcon,
  FileTextIcon,
  ImageIcon,
} from "@phosphor-icons/react";

export function getPortfolioFileLabel(url: string): string {
  const name = url.split("/").pop() ?? url;
  return name.replace(/^\d+-/, "");
}

type PortfolioFileIconProps = {
  url: string;
  size?: number;
};

export function PortfolioFileIcon({ url, size = 18 }: PortfolioFileIconProps) {
  const ext = url.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    return (
      <FilePdfIcon
        size={size}
        weight="fill"
        className="shrink-0 text-red-400"
      />
    );
  }
  if (ext === "png" || ext === "jpg" || ext === "jpeg") {
    return (
      <ImageIcon
        size={size}
        weight="regular"
        className="shrink-0 text-[#9CCB3B]"
      />
    );
  }
  return (
    <FileTextIcon
      size={size}
      weight="regular"
      className="shrink-0 text-gray-500"
    />
  );
}
