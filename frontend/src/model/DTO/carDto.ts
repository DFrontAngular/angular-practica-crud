import { BrandDto } from "./brandDto";
import { ModelDto } from "./modelDto";

export class CarDto {
    id: string;
    brand: BrandDto;
    model: ModelDto;
    total: number;
    imageUrl: string;

    constructor(
        id: string,
        brand: BrandDto,
        model: ModelDto,
        total: number,
        imageUrl: string
    ) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.total = total;
        this.imageUrl = imageUrl;
    }
}