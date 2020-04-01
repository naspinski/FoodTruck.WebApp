export class BaseModel {

    id: number = 0;
    name: string = '';
    public get sanitizedNamed(): string {
        return this.name === null ? '' : this.name.replace(/\W/g, '');
    }

    constructor(init?: Partial<BaseModel>) {
        Object.assign(this, init);
    }
}