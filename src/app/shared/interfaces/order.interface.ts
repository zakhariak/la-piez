import { IProduct } from './product.interface';

export interface IOrder {
    id: any;
    userName: string;
    userPhone: string;
    userCity: string;
    userStreet: string;
    userHouse: string;
    ordersDetails: Array<IProduct>;
    totalPayment: number;
    dateOrder: string;
    userComment: string;
    payment: string;
    delivery: string;
    status: string;
}
