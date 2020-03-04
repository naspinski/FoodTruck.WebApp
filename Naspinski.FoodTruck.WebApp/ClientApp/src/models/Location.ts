export class Location {
    id: string = '';
    name: string = '';
    address: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    latitude: number = 0;
    longitude: number = 0;
    
    constructor(init?: Partial<Location>) {
        Object.assign(this, init);
    }
}