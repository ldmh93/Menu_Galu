/** Formato de precio de la casa: entero cuando no hay centavos. */
export function formatPrice(value: number): string {
  const hasCents = !Number.isInteger(value);
  return `$${value.toLocaleString("es-MX", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Une clases condicionales sin dependencias externas. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
