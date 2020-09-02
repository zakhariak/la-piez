import { ICategory } from "../interfaces/category.interface";
import { IProduct } from "../interfaces/product.interface";

export class Product implements IProduct {
    constructor(
        public id: string,
        public category: ICategory,
        public nameEN: string,
        public nameUA: string,
        public description: string,
        public weight: string,
        public price: number,
        public image: string,
        public count: number = 1,
    ) { }
}