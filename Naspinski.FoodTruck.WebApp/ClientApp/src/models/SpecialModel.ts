export class SpecialModel {
    name: string = '';
    description: string = '';
    beginsString: string = '';
    endsString: string = '';
    public get isAllDay(): boolean {
        return this.beginsString.length === 0 && this.endsString.length === 0;
    }
    public get timeDisplay(): string {
        return this.isAllDay
            ? 'all day'
            : this.beginsString + (this.beginsString.length > 0 && this.endsString.length > 0 ? ' - ' : '') + this.endsString;
    }
    
    constructor(init?: Partial<SpecialModel>) {
        Object.assign(this, init);
    }
}