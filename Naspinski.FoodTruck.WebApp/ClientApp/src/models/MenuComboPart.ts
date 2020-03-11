import { BaseModel } from "./BaseModel";

export class MenuComboPart {

    id: number = 0;
    categoryId: number = 0;
    menuItemId: number = 0;
    options: BaseModel[] = [];

    constructor(init?: Partial<MenuComboPart>) {
        Object.assign(this, init);
    }
}