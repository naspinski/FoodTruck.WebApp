import { Utilities } from "../Utility";

export class BaseModel {

    id: number = 0;
    name: string = '';
    public get sanitizedNamed(): string {
        return Utilities.Sanitize(this.name);
    }

    constructor(init?: Partial<BaseModel>) {
        Object.assign(this, init);
    }
}