export interface Species {
  id: number;
  name?: string | undefined;
  specieGroupId: number;
}

export interface SpeciesGroup {
  id: number;
  name: string;
}
