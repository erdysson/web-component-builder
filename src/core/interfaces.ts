import {ViewEncapsulation} from './enums';
// eslint-disable-next-line @typescript-eslint/ban-types
export interface Class<TClass extends {} = {}> extends Function {
    new (...args: any[]): TClass;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type InstanceOf<T extends {} = {}> = T;

export interface IClassDecorator {
    (target: Class): void;
}

export interface IPropertyDecorator {
    (target: any, propertyKey: string, descriptor?: PropertyDescriptor): void;
}

export interface IMethodDecorator {
    (target: any, propertyKey: string, descriptor?: PropertyDescriptor): void;
}

export interface IModuleConfig {
    components: Class[];
    providers: Class[];
}

export interface IComponentConfig {
    selector: string;
    template: string;
    viewEncapsulation?: ViewEncapsulation;
    styles?: string[];
}

export interface IAttrChanges {
    name: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface IPropChanges {
    name: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface IOnAttrChanges {
    onAttrChanges(changes?: IAttrChanges): void;
}

export interface IOnPropChanges {
    onPropChanges(changes?: IPropChanges): void;
}

export interface IOnInit {
    onInit(): void;
}

export interface IOnViewInit {
    onViewInit(): void;
}

export interface IOnDestroy {
    onDestroy(): void;
}
