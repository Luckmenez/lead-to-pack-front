import Image from "next/image";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="w-full py-4 px-8 flex justify-between">
      <div className="relative w-48 h-12">
        <Image
          src="/logo_Lead2Pack.svg"
          alt="Lead 2 Pack Logo"
          fill
          loading="eager"
        />
      </div>
      <div className="flex gap-4 ">
        <Button className="bg-cyan-800 rounded-full text-gray-200">
          Comprador
        </Button>
        <Button className="bg-lime-600/60 rounded-full text-gray-200">
          Fornecedor
        </Button>
        <Button className="bg-blue-950 rounded-full text-gray-200">
          Profissional do Setor
        </Button>
      </div>
      <div className="flex gap-4">
        <Button className="rounded-full bg-cyan-300/20 text-secondary-foreground">
          Cadastro Gratuito
        </Button>
        <Button className="ml-4 rounded-full">login</Button>
      </div>
    </header>
  );
}
