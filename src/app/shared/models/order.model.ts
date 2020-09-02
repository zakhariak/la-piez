import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';

export class Order implements IOrder {
    constructor(public id: any,
        public userName: string,
        public userPhone: string,
        public userCity: string,
        public userStreet: string,
        public userHouse: string,
        public ordersDetails: Array<IProduct>,
        public totalPayment: number,
        public dateOrder: string,
        public userComment: string,
        public payment: string,
        public delivery: string,
        public status: string = 'в обробці',
    ) { }
}
