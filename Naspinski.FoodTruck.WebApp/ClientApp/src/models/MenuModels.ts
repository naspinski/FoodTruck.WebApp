import { BaseModel } from "./BaseModel";

export class MenuBase extends BaseModel {

    description: string = '';
    sortOrder: number = 0;
    hasDescription: boolean = false;

    constructor(init?: Partial<MenuBase>) {
        super(init);
        Object.assign(this, init);
    }
}

export class MenuCategory extends MenuBase {

    excludeFromMenu: boolean = true;
    excludeFromOrdering: boolean = true;
    menuItems: MenuItem[] = [];

    constructor(init?: Partial<MenuCategory>) {
        super(init);
        Object.assign(this, init);
    }
}

export class MenuItem extends MenuBase {

    imageLocation: string = '';
    prices: MenuPrice[] = [];
    comboParts: MenuComboPart[] = []

    public get hasImage(): boolean {
        return this.imageLocation !== null && this.imageLocation.length > 0;
    }

    constructor(init?: Partial<MenuItem>) {
        super(init);
        Object.assign(this, init);
    }
}

export class MenuPrice {

    id: number = 0;
    priceTypeId: number = 0;
    menuItemId: number = 0;
    amount: number = 0;
    amountAsCurrency: string = '';
    priceTypeName: string = '';
    priceTypeSortOrder: number = 0;

    constructor(init?: Partial<MenuPrice>) {
        Object.assign(this, init);
    }
}

export class MenuComboPart {

    id: number = 0;
    categoryId: number = 0;
    menuItemId: number = 0;
    options: MenuOption[] = [];

    constructor(init?: Partial<MenuComboPart>) {
        Object.assign(this, init);
    }
}

export class MenuOption extends BaseModel {

    selected: boolean = false;

    constructor(init?: Partial<MenuOption>) {
        super(init);
        Object.assign(this, init);
    }
}