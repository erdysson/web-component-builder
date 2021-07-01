// eslint-disable-next-line @typescript-eslint/ban-types
export interface Class<TClass extends {} = {}> extends Function {
    // <TParam extends Class>(...args: TParam[]): TClass;
    // new <TParam extends Class>(...args: TParam[]): TClass;
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
    shadow: boolean;
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
