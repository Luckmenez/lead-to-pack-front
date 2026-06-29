import {
  getPortfolioFileLabel,
  PortfolioFileIcon,
} from "@/components/portfolio/PortfolioFileDisplay";

const MAX_PREVIEW = 3;

type Props = {
  urls: string[];
};

export function DiscoveryPortfolioPreview({ urls }: Props) {
  if (!urls.length) return null;

  const preview = urls.slice(0, MAX_PREVIEW);
  const extra = urls.length - preview.length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
      {preview.map((url) => (
        <div
          key={url}
          className="flex min-w-0 items-center gap-1.5 text-xs text-gray-600"
        >
          <PortfolioFileIcon url={url} size={14} />
          <span className="max-w-[140px] truncate">
            {getPortfolioFileLabel(url)}
          </span>
        </div>
      ))}
      {extra > 0 && (
        <span className="text-xs text-gray-500">
          +{extra} arquivo{extra !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
