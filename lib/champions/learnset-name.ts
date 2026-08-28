export function resolveChampoutLearnsetName(showdownName: string, formKind: string): string {
  if (!/^mega(?:\s|$)/i.test(formKind)) return showdownName;
  if (/-mega(?:[-\s]?[xy])?$/i.test(showdownName)) return showdownName;

  const suffix = formKind.replace(/^mega\s*/i, "");
  return `${showdownName}-Mega${suffix ? ` ${suffix}` : ""}`;
}
