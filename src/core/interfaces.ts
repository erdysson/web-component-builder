export interface Class<TClass = any> extends Function {
    // <TParam extends Class>(...args: TParam[]): TClass;
    // new <TParam extends Class>(...args: TParam[]): TClass;
    new (...args: any[]): TClass;
}

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
}

export interface IAttrChanges {
    name: string;
    oldValue: string | null;
    newValue: string | null;
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
    onAttrChanges(changes?: IPropChanges): void;
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
