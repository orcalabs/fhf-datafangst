export interface Gear {
  id: number;
  name: string;
}

export interface GearGroup {
  id: number;
  name: string;
}

export interface GearMainGroup {
  id: number;
  name: string;
}

export const GearGroupCodes: GearGroup[] = [
  { name: "Not", id: 1 },
  { name: "Garn", id: 2 },
  { name: "Krokredskap", id: 3 },
  { name: "Bur Og Ruser", id: 4 },
  { name: "Trål", id: 5 },
  { name: "Snurrevad", id: 6 },
  { name: "Harpun Kanon", id: 7 },
  { name: "Andre Redskap", id: 8 },
];
