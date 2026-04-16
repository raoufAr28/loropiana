export type DeliveryType = "bureau" | "domicile";

export interface WilayaPricing {
  name: string;
  bureau: number;
  domicile: number;
  retour: number;
  delay: string;
}

export const DELIVERY_PRICING: Record<string, WilayaPricing> = {
  "01": { name: "Adrar", bureau: 900, domicile: 1200, retour: 350, delay: "48 - 96 H" },
  "02": { name: "Chlef", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "03": { name: "Laghouat", bureau: 600, domicile: 900, retour: 200, delay: "24 - 48 H" },
  "04": { name: "Oum El Bouaghi", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "05": { name: "Batna", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "06": { name: "Béjaïa", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "07": { name: "Biskra", bureau: 550, domicile: 850, retour: 200, delay: "24 - 48 H" },
  "08": { name: "Béchar", bureau: 900, domicile: 1200, retour: 350, delay: "48 - 96 H" },
  "09": { name: "Blida", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "10": { name: "Bouira", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "11": { name: "Tamanrasset", bureau: 1200, domicile: 1600, retour: 400, delay: "48 - 96 H" },
  "12": { name: "Tébessa", bureau: 550, domicile: 850, retour: 200, delay: "24 - 48 H" },
  "13": { name: "Tlemcen", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "14": { name: "Tiaret", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "15": { name: "Tizi Ouzou", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "16": { name: "Alger", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "17": { name: "Djelfa", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "18": { name: "Jijel", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "19": { name: "Sétif", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "20": { name: "Saïda", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "21": { name: "Skikda", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "22": { name: "Sidi Bel Abbès", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "23": { name: "Annaba", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "24": { name: "Guelma", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "25": { name: "Constantine", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "26": { name: "Médéa", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "27": { name: "Mostaganem", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "28": { name: "M'Sila", bureau: 300, domicile: 500, retour: 150, delay: "24 - 48 H" },
  "29": { name: "Mascara", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "30": { name: "Ouargla", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "31": { name: "Oran", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "32": { name: "El Bayadh", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "33": { name: "Illizi", bureau: 1500, domicile: 1800, retour: 400, delay: "48 - 96 H" },
  "34": { name: "Bordj Bou Arreridj", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "35": { name: "Boumerdès", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "36": { name: "El Tarf", bureau: 550, domicile: 850, retour: 200, delay: "24 - 48 H" },
  "37": { name: "Tindouf", bureau: 1200, domicile: 1600, retour: 400, delay: "48 - 96 H" },
  "38": { name: "Tissemsilt", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "39": { name: "El Oued", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "40": { name: "Khenchela", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "41": { name: "Souk Ahras", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "42": { name: "Tipaza", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "43": { name: "Mila", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },
  "44": { name: "Aïn Defla", bureau: 400, domicile: 700, retour: 150, delay: "24 - 48 H" },
  "45": { name: "Naâma", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "46": { name: "Aïn Témouchent", bureau: 550, domicile: 800, retour: 150, delay: "24 - 48 H" },
  "47": { name: "Ghardaïa", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "48": { name: "Relizane", bureau: 450, domicile: 750, retour: 150, delay: "24 - 48 H" },

  // New wilayas 49–58 (exact order from tariff sheet)
  "49": { name: "Timimoun", bureau: 900, domicile: 1200, retour: 350, delay: "48 - 96 H" },
  "50": { name: "Bordj Badji Mokhtar", bureau: 1500, domicile: 1800, retour: 400, delay: "48 - 96 H" },
  "51": { name: "Ouled Djellal", bureau: 600, domicile: 900, retour: 200, delay: "24 - 72 H" },
  "52": { name: "Beni Abbes", bureau: 900, domicile: 1200, retour: 350, delay: "48 - 96 H" },
  "53": { name: "In Salah", bureau: 900, domicile: 1200, retour: 350, delay: "48 - 96 H" },
  "54": { name: "In Guezzam", bureau: 1500, domicile: 1800, retour: 400, delay: "48 - 96 H" },
  "55": { name: "Touggourt", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "56": { name: "Djanet", bureau: 1500, domicile: 1800, retour: 400, delay: "48 - 96 H" },
  "57": { name: "El M'Ghair", bureau: 700, domicile: 1000, retour: 200, delay: "24 - 72 H" },
  "58": { name: "El Meniaa", bureau: 800, domicile: 1100, retour: 350, delay: "24 - 72 H" }
};

export function normalizeWilayaCode(code?: string | number | null): string {
  if (code === null || code === undefined) return "";
  return String(code).padStart(2, "0");
}

export function getShippingFee(
  wilayaCode: string | number | null | undefined,
  type: DeliveryType
): number {
  const code = normalizeWilayaCode(wilayaCode);
  const pricing = DELIVERY_PRICING[code];

  // Safe fallback only if code truly unknown
  if (!pricing) {
    return type === "bureau" ? 400 : 700;
  }

  return pricing[type];
}

export function getWilayaPricing(wilayaCode: string | number | null | undefined) {
  const code = normalizeWilayaCode(wilayaCode);
  return DELIVERY_PRICING[code] || null;
}
