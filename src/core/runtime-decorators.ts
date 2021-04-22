import {IClass} from './interfaces';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const RuntimeClass = (
    componentClass: IClass,
    observedAttributes: string[] = [],
    properties: string[] = []
): ClassDecorator => (target: IClass) => {
    const runtimeIdentifier = Symbol(componentClass.name);
    Object.defineProperty(target.prototype, 'mappedClassConstructor', {
        value: componentClass
    });
    Object.defineProperty(target.prototype, 'identifier', {
        value: runtimeIdentifier
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log('runtime class decorator called with identifier', target.prototype.identifier);

    // console.log('mapped custom element class :', target);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // console.log('observed attr', target.observedAttributes);
    // define observed attributes
    Object.defineProperty(target, 'observedAttributes', {
        value: observedAttributes
    });
    // define properties and attach setters to callback
    properties.forEach((prop) => {
        Object.defineProperty(target.prototype, prop, {
            set(newValue: unknown) {
                const oldValue = this.value;
                // call lc method
                this.propertyChangedCallback(prop, oldValue, newValue);
                // then update the value
                this.value = newValue;
            }
        });
    });
};
