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