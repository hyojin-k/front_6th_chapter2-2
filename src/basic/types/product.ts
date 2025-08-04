import { ProductType } from '../../types';

export interface ProductWithUI extends ProductType {
  description?: string;
  isRecommended?: boolean;
}
