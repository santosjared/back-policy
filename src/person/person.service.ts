import { Model } from 'mongoose';

export class PersonSeervice <T>{
    constructor(private readonly model:Model<T>){}

    async find(data?:Partial<T>):Promise<T[]>{
        return this.model.find(data!).exec();
    }

    async findOne(data?:Partial<T>):Promise<T>{
        return this.model.findOne(data!).exec();
    }

    async create(data:Partial<T>):Promise<T>{
        return this.model.create(data);
    }
}