import { MenuBase } from "./MenuBase";
import { MenuPrice } from "./MenuPrice";
import { MenuComboPart } from "./MenuComboPart";

export class MenuItem extends MenuBase {

    isCombo: boolean = false;
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