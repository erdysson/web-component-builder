import {IClass, IObject, IOnAttrChanges, IOnDestroy, IOnInit, IOnPropChanges, IOnViewInit} from './interfaces';

export interface IInjectMetadata {
    providerClass: IClass;
    targetParameterIndex: number;
}

export interface IAttrMetadata {
    [name: string]: {
        propertyKey: string;
        // eslint-disable-next-line @typescript-eslint/ban-types
        typeConstructor: Function;
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

export type TComponentInstance = Partial<
    IOnAttrChanges & IOnInit & IOnViewInit & IOnPropChanges & IOnDestroy & IObject
>;
