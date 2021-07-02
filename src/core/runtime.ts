import {Class} from './interfaces';
import {Metadata} from './metadata';
import {RuntimeContext} from './runtime-context';

export class Runtime {
    readonly runtimeContextMap: WeakMap<Class, RuntimeContext> = new WeakMap<Class, RuntimeContext>();

    getRunTimeContext(moduleClass: Class): RuntimeContext | null {
        return this.runtimeContextMap.get(moduleClass) || null;
    }

    createRuntimeContext(moduleClass: Class): void {
        // get imported modules here and create context for each
        const moduleConfig = Metadata.getModuleConfig(moduleClass);
        // first initialize imported module(s)'(s) context(s)
        (moduleConfig.imports || []).forEach((importedModuleClass: Class) => {
            if (this.runtimeContextMap.has(importedModuleClass)) {
                return; // do not re-initialize existing context(s)
            }
            // create runtime context
            const context = new RuntimeContext();
            // initialize module
            context.initModule(importedModuleClass, this.runtimeContextMap);
            // assign to runtime context map for future usage
            this.runtimeContextMap.set(importedModuleClass, context);
        });
        // do not re-initialize existing context
        if (!this.runtimeContextMap.has(moduleClass)) {
            // initialize self context
            const context = new RuntimeContext();
            // todo : pass here the imported module contexts
            context.initModule(moduleClass, this.runtimeContextMap);
            this.runtimeContextMap.set(moduleClass, context);
        }
    }
}
