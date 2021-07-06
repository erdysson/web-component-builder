import {Context} from './context';
import {Class} from './interfaces';

export class Runtime {
    readonly context: WeakMap<Class, Context> = new WeakMap<Class, Context>();

    constructor(readonly rootModule: Class) {}

    init(): void {
        new Context(this.rootModule, this);
    }
}
