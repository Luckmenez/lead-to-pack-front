export const TIPO_EMPRESA_VALUES = [
  "mei",
  "lucro_presumido",
  "simples_nacional",
] as const;

export type TipoEmpresa = (typeof TIPO_EMPRESA_VALUES)[number];

export const TIPO_EMPRESA_OPCOES: { value: TipoEmpresa; label: string }[] = [
  { value: "mei", label: "MEI" },
  { value: "lucro_presumido", label: "Lucro Presumido" },
  { value: "simples_nacional", label: "Simples Nacional" },
];
