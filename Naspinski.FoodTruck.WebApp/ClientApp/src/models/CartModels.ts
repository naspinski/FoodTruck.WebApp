import { MenuPrice, MenuItem, MenuCategory, MenuComboPart, MenuOption } from './MenuModels';

export class Cart {
    storageKey: string = 'ft_cart';
    isHidden: boolean = true;
    isWorking: boolean = false;
    items: CartItem[] = [];
    isStorageEnabled: boolean = typeof (Storage) !== undefined;
    termsAcknowledged: boolean = false;
    menuItems: MenuItem[];

    public get itemCount(): number {
        return this.items.map(x => x.quantity).reduce((quantity, total) => quantity + total, 0);
    }

    public get total(): number {
        return this.items.map(x => x.totalPrice).reduce((itemTotal, total) => itemTotal + total, 0);
    }
    public get totalCost(): string {
        return CartUtil.formatter.format(this.total);
    }
    
    constructor(init?: Partial<Cart>) {
        Object.assign(this, init);
    }

    public action(action: CartAction) {
        switch (action.task) {
            case 'toggle': this.isHidden = !this.isHidden; break;
            case 'add': this.add(action); break;
            case 'remove': this.remove(action); break;
            case 'populate-items': this.menuItems = action.categories.reduce((collection: MenuItem[], category:MenuCategory) => collection.concat(category.menuItems), [])
            default: console.warn(`${action.task} is not implemented yet`);
        }
    }

    public add(action: CartAction, quantity?: number) {
        quantity = quantity ?? 1;
        var item = new CartItem();
        item.loadFromAction(action);
        let existing = this.items.find(x => x.key === item.key);
        console.log('existing', item.key);
        if (existing === undefined) {
            this.items.push(item);
        } else {
            existing.quantity += quantity;
        }
    }

    public remove(action: CartAction) {
        this.items = this.items.filter(x => x.key !== action.key);
        this.isHidden = this.itemCount === 0 ? true : this.isHidden;
    }

    public load(): void {
        if (this.isStorageEnabled && sessionStorage.getItem(this.storageKey) !== undefined && sessionStorage.getItem(this.storageKey) !== null) {
            const items = JSON.parse(sessionStorage.getItem(this.storageKey));
            this.items = items === null ? [] : items.map(x => new CartItem(x));
        }
    }

    writeToStorage() {
        if (this.isStorageEnabled) {
            sessionStorage.setItem(this.storageKey, JSON.stringify(this.items));
        }
        if (this.items.length === 0) {
            this.termsAcknowledged = false;
        }
    }

    clearStorage() {
        this.items = []
        if (this.isStorageEnabled) {
            sessionStorage.removeItem(this.storageKey);
        }
    }
}

export class CartItem {

    priceId: number = 0;
    itemId: number = 0;
    quantity: number = 0;
    name: string = '';
    priceTypeName: string = '';

    price: number = 0;
    public get totalPrice(): number { return this.quantity * this.price }
    public get totalCost(): string { return CartUtil.formatter.format(this.totalPrice); }

    public get parts(): string {
        return this.itemKey.options.map(x => x.name).join(', ');
    }

    itemKey: CartItemKey = new CartItemKey();
    public get key(): string {
        return this.itemKey.key;
    }

    constructor(init?: Partial<CartItem>) {
        Object.assign(this, init);
    }

    loadFromAction(action: CartAction) {
        this.priceId = action.price.id;
        this.itemId = action.item.id;
        this.quantity = 1;
        this.name = action.item.name;
        this.price = action.price.amount;
        this.priceTypeName = action.price.priceTypeName;

        const options = action.item.comboParts.map(cp => cp.options.find(o => o.selected)).filter(x => x !== undefined);

        this.itemKey = new CartItemKey({
            itemId: action.item.id,
            priceId: action.price.id,
            options: options
        });
    }
}

export class CartItemKey {
    itemId: number = 0;
    priceId: number = 0;
    options: MenuOption[] = [];

    public get key(): string {
        const key = `item-${this.itemId}-price-${this.priceId}`;
        const combo = this.options.length === 0 ? '' : `-options-${this.options.map(x => x.id).join('-')}`;
        return key + combo;
    }

    constructor(init?: Partial<CartItemKey>) {
        Object.assign(this, init);
    }
}

export class CartUtil {
    public static formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
}

export class CartAction {
    task: 'add' | 'remove' | 'pay' | 'toggle' | 'populate-items';
    price: MenuPrice = new MenuPrice();
    item: MenuItem = new MenuItem();
    key: string = '';
    categories: MenuCategory[] = [];

    constructor(init?: Partial<CartAction>) {
        Object.assign(this, init);
    }
}