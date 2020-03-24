import { BaseModel } from "./BaseModel";

export class MenuBase extends BaseModel{

    description: string = '';
    sortOrder: number = 0;
    hasDescription: boolean = false;

    constructor(init?: Partial<MenuBase>) {
        super(init);
        Object.assign(this, init);
    }
}