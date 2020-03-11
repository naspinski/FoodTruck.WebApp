import { BaseModel } from "./BaseModel";

export class Location extends BaseModel {
    address: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    latitude: number = 0;
    longitude: number = 0;
    
    constructor(init?: Partial<Location>) {
        super(init);
        Object.assign(this, init);
    }
}