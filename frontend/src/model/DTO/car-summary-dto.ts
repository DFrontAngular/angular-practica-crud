import { CarBrandSummaryDto } from "./car-brand-summary-dto";
import { CarModelSummaryDto } from "./car-model-summary-dto";

export interface CarSummaryDto {
    id: string;
    brand: CarBrandSummaryDto;
    model: CarModelSummaryDto;
    total: number;
    imageUrl: string;
}