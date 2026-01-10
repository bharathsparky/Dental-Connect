export interface VitaShade {
  code: string
  hex: string
  description: string
}

export interface VitaGroup {
  name: string
  shades: VitaShade[]
}

export const VITA_SHADES: Record<string, VitaGroup> = {
  A: {
    name: "A (Reddish-Brown)",
    shades: [
      { code: "A1", hex: "#F5E6D3", description: "Lightest" },
      { code: "A2", hex: "#E8D4BC", description: "Light" },
      { code: "A3", hex: "#D9C4A5", description: "Medium" },
      { code: "A3.5", hex: "#CCAC82", description: "Medium-Dark" },
      { code: "A4", hex: "#C19A6B", description: "Dark" },
    ]
  },
  B: {
    name: "B (Reddish-Yellow)",
    shades: [
      { code: "B1", hex: "#F7EBD5", description: "Lightest" },
      { code: "B2", hex: "#EBD9B8", description: "Light" },
      { code: "B3", hex: "#DBC59E", description: "Medium" },
      { code: "B4", hex: "#C9A97A", description: "Dark" },
    ]
  },
  C: {
    name: "C (Greyish)",
    shades: [
      { code: "C1", hex: "#EDE5D8", description: "Lightest" },
      { code: "C2", hex: "#DDD3C2", description: "Light" },
      { code: "C3", hex: "#C9BDAB", description: "Medium" },
      { code: "C4", hex: "#B5A793", description: "Dark" },
    ]
  },
  D: {
    name: "D (Reddish-Grey)",
    shades: [
      { code: "D2", hex: "#E5D9C7", description: "Light" },
      { code: "D3", hex: "#D4C5AE", description: "Medium" },
      { code: "D4", hex: "#C2AF94", description: "Dark" },
    ]
  }
}

export const getAllShades = (): VitaShade[] => {
  return Object.values(VITA_SHADES).flatMap(group => group.shades)
}

export const getShadeByCode = (code: string): VitaShade | undefined => {
  return getAllShades().find(shade => shade.code === code)
}
