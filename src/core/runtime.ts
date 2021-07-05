import {Context} from './context';
import {Class} from './interfaces';

export class Runtime {
    readonly context: WeakMap<Class, Context> = new WeakMap<Class, Context>();

    init(rootModuleClass: Class): void {
        new Context(rootModuleClass, this);
    }
}
