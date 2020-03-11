import { MenuBase } from "./MenuBase";
import { MenuItem } from "./MenuItem";

export class MenuCategory extends MenuBase {

    excludeFromMenu: boolean = true;
    excludeFromOrdering: boolean = true;
    menuItems: MenuItem[] = [];

    constructor(init?: Partial<MenuCategory>) {
        super(init);
        Object.assign(this, init);
    }
}