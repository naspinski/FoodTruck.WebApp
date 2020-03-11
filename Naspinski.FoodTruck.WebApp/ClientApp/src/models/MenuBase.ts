import { BaseModel } from "./BaseModel";

export class MenuBase extends BaseModel{

    description: string = '';
    sortOrder: number = 0;

    public get hasDescription(): boolean {
        return this.description !== null && this.description.length > 0;
    }

    constructor(init?: Partial<MenuBase>) {
        super(init);
        Object.assign(this, init);
    }
}