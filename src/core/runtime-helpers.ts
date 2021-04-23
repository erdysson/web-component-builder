export function inferType(from: string, ctor: BooleanConstructor | NumberConstructor) {
    switch (ctor) {
        case Boolean:
            return Boolean(from);
        case Number:
            return Number(from);
        default:
            return from;
    }
}
