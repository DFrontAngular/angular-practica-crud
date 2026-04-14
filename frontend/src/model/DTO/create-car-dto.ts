import { CreateCarDetailsDto } from "./create-car-details";

export interface CreateCarDto {
    brandId: number;
    modelId: number;
    carDetails: CreateCarDetailsDto[];
}