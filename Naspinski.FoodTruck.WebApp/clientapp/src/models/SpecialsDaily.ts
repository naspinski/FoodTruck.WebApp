import { SpecialModel } from "./SpecialModel";

export class SpecialsDaily {
    specialsObject: {} = new Object();

    public get specials(): Map<string, SpecialModel[]> {
        return new Map<string, SpecialModel[]>(Object.entries(this.specialsObject));
    }
    
    constructor(init?: Partial<SpecialsDaily>) {
        Object.assign(this, init);
    }
}