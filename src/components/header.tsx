import Image from "next/image";

export function Header() {
  return (
    <header className="w-full bg-white px-8 py-4 shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
      <div className="flex justify-between">
        <div className="relative h-12 w-48">
          <Image
            src="/logo_Lead2Pack.svg"
            alt="Lead 2 Pack Logo"
            fill
            loading="eager"
          />
        </div>
      </div>
    </header>
  );
}
