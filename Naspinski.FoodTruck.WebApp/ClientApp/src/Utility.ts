export class RegularExpressions {
    public static phone: RegExp = /^\d{10}$/;
    public static email: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
}