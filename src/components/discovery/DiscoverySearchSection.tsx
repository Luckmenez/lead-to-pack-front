"use client";

import {
  MagnifyingGlassIcon,
  FunnelSimple,
  CaretDownIcon,
} from "@phosphor-icons/react";

type CategoryOption = { value: string; label: string };

type DiscoverySearchSectionProps = {
  title: string;
  subtitle: string;
  beforeSearch?: React.ReactNode;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showCategoryFilter?: boolean;
  categoryValue?: string;
  onCategoryChange?: (value: string) => void;
  categoryOptions?: CategoryOption[];
  categoryPlaceholder?: string;
};

export function DiscoverySearchSection({
  title,
  subtitle,
  beforeSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSubmit,
  showCategoryFilter = false,
  categoryValue = "",
  onCategoryChange,
  categoryOptions = [],
  categoryPlaceholder = "Todos os materiais",
}: DiscoverySearchSectionProps) {
  return (
    <>
      <section className="mb-6 text-center">
        <h1 className="text-balance font-sans text-[28px] font-bold leading-[1.4] tracking-normal text-[#284161] sm:text-[36px]">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-[43rem] text-balance font-sans text-[18px] font-medium leading-[1.7] text-[#757575] sm:text-[20px]">
          {subtitle}
        </p>
      </section>

      {beforeSearch ? <div className="mb-6">{beforeSearch}</div> : null}

      <form onSubmit={onSubmit} className="mb-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
            <div className="relative min-h-[52px] min-w-0 flex-1">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-3 top-1/2 z-1 -translate-y-1/2 text-[#757575]"
                size={22}
                weight="regular"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-[52px] w-full rounded-[10px] border border-[#E2E8F0] bg-white py-3 pl-11 pr-4 font-sans text-base text-[#1a1c1e] outline-none transition placeholder:text-[#9ca3af] focus:border-[#284161] focus:ring-2 focus:ring-[#284161]/20"
              />
            </div>

            {showCategoryFilter ? (
              <>
                <div
                  className="hidden w-px shrink-0 self-stretch bg-[#E2E8F0] lg:block"
                  aria-hidden
                />
                <div className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2 sm:flex-[0.85] lg:max-w-[340px]">
                  <FunnelSimple
                    size={22}
                    weight="regular"
                    className="shrink-0 text-[#757575]"
                    aria-hidden
                  />
                  <div className="relative min-w-0 flex-1">
                    <select
                      value={categoryValue}
                      onChange={(e) => onCategoryChange?.(e.target.value)}
                      className="h-[52px] w-full cursor-pointer appearance-none rounded-[10px] border border-[#E2E8F0] bg-white py-3 pl-3 pr-10 font-sans text-base text-[#1a1c1e] outline-none focus:border-[#284161] focus:ring-2 focus:ring-[#284161]/20"
                    >
                      <option value="">{categoryPlaceholder}</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <CaretDownIcon
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#757575]"
                      size={18}
                      weight="bold"
                    />
                  </div>
                </div>
              </>
            ) : null}

            <button
              type="submit"
              className="h-[52px] shrink-0 rounded-[10px] bg-[#284161] px-8 font-sans text-base font-medium text-white transition hover:bg-[#1f3550] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#284161]"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export function DiscoveryResultsCount({
  total,
  entityLabel,
}: {
  total: number;
  entityLabel: string;
}) {
  return (
    <p className="mb-4 font-sans text-base font-semibold text-[#1a1c1e]">
      {total} {entityLabel} encontrados
    </p>
  );
}
