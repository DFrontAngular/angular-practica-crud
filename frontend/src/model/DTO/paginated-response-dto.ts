import { CarSummaryDto } from "./car-summary-dto";
import { PaginatedMetaDto } from "./paginated-meta-dto";

export interface PaginatedResponseDto {
    items: CarSummaryDto[];
    meta: PaginatedMetaDto;
}