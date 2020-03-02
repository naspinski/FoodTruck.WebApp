export class Location {
    name: string = '';
    address: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    
    constructor(init?: Partial<Location>) {
        Object.assign(this, init);
    }
}