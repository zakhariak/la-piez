import { IBlog } from '../interfaces/blog.interface';


export class Blog implements IBlog {
    constructor(
        public id: any,
        public title: string,
        public text: string,
        public date: string,
        public author: string,
        public image: string
    ) { }
}