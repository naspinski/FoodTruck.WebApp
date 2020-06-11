import { MenuPrice, MenuItem, MenuCategory, MenuOption } from './MenuModels';
import { Utilities } from '../Utility';

export class Cart {
    storageKey: string = '';
    isHidden: boolean = true;
    isWorking: boolean = false;
    items: CartItem[] = [];
    isStorageEnabled: boolean = typeof (Storage) !== undefined;
    //menuItems: MenuItem[];
    name: string = '';
    email: string = '';
    phone: string = '';
    disabled: boolean = false;
    
    public get itemCount(): number {
        return this.items.map(x => x.quantity).reduce((quantity, total) => quantity + total, 0);
    }

    public get subTotal(): number {
        return this.items.map(x => x.totalPrice).reduce((itemTotal, total) => itemTotal + total, 0);
    }
    public get subTotalCost(): string {
        return CartUtil.formatter.format(this.subTotal);
    }

    
    constructor(init?: Partial<Cart>) {
        Object.assign(this, init);
    }

    public action(action: CartAction) {
        switch (action.task) {
            case 'disable': this.disabled = true; break;
            case 'enable': this.disabled = false; break;
            case 'toggle': this.isHidden = !this.isHidden; break;
            case 'add': this.add(action); break;
            case 'remove': this.remove(action); break;
            case 'clear': this.clear(); break;
            //case 'populate-items': this.populate(action); break;
            default: console.warn(`${action.task} is not implemented yet`);
        }
    }

    add(action: CartAction, quantity?: number) {
        if (!this.disabled) {
            quantity = quantity ?? 1;
            var item = new CartItem();
            item.loadFromAction(action);
            let existing = this.items.find(x => x.key === item.key);
            if (existing === undefined) {
                this.items.push(item);
            } else {
                existing.quantity += quantity;
            }
            this.writeToStorage();
        }
    }

    remove(action: CartAction) {
        if (!this.disabled) {
            this.items = this.items.filter(x => x.key !== action.key);
            this.isHidden = this.itemCount === 0 ? true : this.isHidden;
        }
    }

    public initStorage(title: string) {
        this.storageKey = `ft-${Utilities.Sanitize(title)}`;
        this.load();
    }

    public load(): void {
        if (this.isStorageEnabled && this.storageKey.length > 0 && localStorage.getItem(this.storageKey) !== undefined && localStorage.getItem(this.storageKey) !== null) {
            const items = JSON.parse(localStorage.getItem(this.storageKey));
            this.items = items === null ? [] : items.map(x => new CartItem(x));
        }
    }

    writeToStorage() {
        if (this.isStorageEnabled && this.storageKey.length > 0) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        }
    }

    clear() {
        this.items = []
        this.isHidden = true;
        if (this.isStorageEnabled && this.storageKey.length > 0) {
            localStorage.removeItem(this.storageKey);
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

export class CartCardData {
    digital_wallet_type: string = 'NONE';
    card_brand: string = '';
    last_4: string = ''
    exp_month: number = 0;
    exp_year: number = 0;
    billing_postal_code: string = '';
    
    constructor(init?: Partial<CartCardData>) {
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
    task: 'add' | 'remove' | 'pay' | 'toggle' | 'clear' | 'disable' | 'enable';
    price: MenuPrice = new MenuPrice();
    item: MenuItem = new MenuItem();
    key: string = '';
    categories: MenuCategory[] = [];

    constructor(init?: Partial<CartAction>) {
        Object.assign(this, init);
    }
}