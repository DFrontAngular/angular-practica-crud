import { ModelDao } from "./model-dao";

export interface BrandDao {
    id: string;
    name: string;
    models: ModelDao[];
}