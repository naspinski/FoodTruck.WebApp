export class BaseModel {

    id: string = '';
    name: string = '';

    constructor(init?: Partial<BaseModel>) {
        Object.assign(this, init);
    }
}