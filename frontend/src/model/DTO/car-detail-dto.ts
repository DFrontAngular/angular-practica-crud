import { CarBrandSummaryDto } from "./car-brand-summary-dto";
import { CarDetailEntityDto } from "./car-detail-entity-dto";
import { CarModelSummaryDto } from "./car-model-summary-dto";

export interface CarDetailDto {
    id: string;
    brand: CarBrandSummaryDto;
    model: CarModelSummaryDto;
    carDetails: CarDetailEntityDto[];
    total: number;
}