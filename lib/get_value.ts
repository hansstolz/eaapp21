export function getObjektWert<T, K extends keyof T>(
  meinObjekt: T,
  key: K
): T[K] {
  // T[K] ist der sogenannte "Indexed Access Type" und liefert den
  // korrekten Wert-Typ für den Schlüssel K aus dem Typ T zurück.

  // Beispiel: Wenn T = {id: number, name: string} und K = 'name',
  // dann ist T[K] einfach 'string'.

  return meinObjekt[key]; // Der Zugriff ist typensicher
}
