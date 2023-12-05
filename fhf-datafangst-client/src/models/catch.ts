import { Quality } from "generated/openapi";

export interface Catch {
  speciesFiskeridirId: number;
  livingWeight: number;
  productWeight?: number;
  grossWeight?: number;
  productQualityId?: Quality;
  productQualityName?: string;
}
