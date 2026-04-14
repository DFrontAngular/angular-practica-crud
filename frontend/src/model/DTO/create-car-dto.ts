import { CreateCarDetailsDto } from "./create-car-details";

export interface CreateCarDto {
    brandId: string;
    modelId: string;
    carDetails: CreateCarDetailsDto[];
}