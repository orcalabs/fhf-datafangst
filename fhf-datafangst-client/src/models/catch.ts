import type { Quality } from "~/generated/openapi";

export interface Catch {
  speciesFiskeridirId: number;
  livingWeight: number;
  productWeight?: number;
  grossWeight?: number;
  productQualityId?: Quality;
  productQualityName?: string | null;
  priceForFisher?: number | null;
}
