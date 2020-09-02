import { ICategory } from "../interfaces/category.interface";

export interface IProduct {
    id: string;
    category: ICategory;
    nameEN: string;
    nameUA: string;
    description: string;
    weight: string;
    price: number;
    image: string;
    count: number;
}