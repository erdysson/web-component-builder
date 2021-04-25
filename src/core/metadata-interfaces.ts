export type PrimitiveTypeConstructor = BooleanConstructor | NumberConstructor;

export interface IAttrMetadata {
    [name: string]: {
        propertyKey: string;
        typeConstructor: PrimitiveTypeConstructor;
    };
}

export interface IPropMetadata {
    [name: string]: {
        propertyKey: string;
    };
}

export interface IViewChildMetadata {
    propertyKey: string;
    querySelector?: string;
}

export interface IEventListenerMetadata {
    propertyKey: string;
    event: string;
    querySelector: string;
    predicate: () => boolean;
}
