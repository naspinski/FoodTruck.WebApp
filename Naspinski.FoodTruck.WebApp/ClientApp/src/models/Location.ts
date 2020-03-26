import { BaseModel } from "./BaseModel";

export class Location extends BaseModel {
    address: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    latitude: number = 0;
    longitude: number = 0;

    public get isValidForMap(): boolean {
        const latLonInvalid = this.latitude === 0 || this.longitude === 0;
        const addressInvalid = this.address === null || this.address.length === 0;
        return !(latLonInvalid && addressInvalid);
    }
    
    constructor(init?: Partial<Location>) {
        super(init);
        Object.assign(this, init);
    }
}