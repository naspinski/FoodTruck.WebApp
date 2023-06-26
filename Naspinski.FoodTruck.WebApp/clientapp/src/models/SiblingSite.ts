export class SiblingSite {
    name: string = '';
    url: string = '';

    constructor(init?: Partial<SiblingSite>) {
        Object.assign(this, init);
    }
}