import {createSandbox, SinonSandbox} from 'sinon';

import {
    Attr,
    bootstrap,
    Component,
    IAttrChanges,
    IComponentConfig,
    IModuleConfig,
    Injectable,
    IOnAttrChanges,
    IOnDestroy,
    IOnInit,
    IOnPropChanges,
    IOnViewInit,
    IPropChanges,
    Listen,
    Module,
    Prop,
    ViewChild,
    ViewContainer,
    ViewEncapsulation
} from '../../src';
import {Runtime} from '../../src/core/runtime';

describe('Runtime functions', () => {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('bootstrap() should create the runtime object and init module', () => {
        const runtimeInitModuleSpy = sandbox.spy(Runtime.prototype, 'initModule');
        // dummy module config
        @Module({
            components: [],
            providers: []
        })
        class M {}
        // bootstrap the module
        bootstrap(M);

        expect(runtimeInitModuleSpy.calledOnce).toBeTrue();
        expect(runtimeInitModuleSpy.getCall(0).args[0]).toEqual(M);
    });

    it('initModule() should register runtime web components in order', () => {
        const initModuleSpy = sandbox.spy(Runtime.prototype, 'initModule');
        const registerComponentSpy = sandbox.spy(Runtime.prototype, 'registerRuntimeWebComponents');

        const componentConfig1: IComponentConfig = {
            selector: 'comp-1',
            template: '<div>Component 1</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        const componentConfig2: IComponentConfig = {
            selector: 'comp-2',
            template: '<div>Component 2</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfig1)
        class C1 {}

        @Component(componentConfig2)
        class C2 {}

        const moduleConfig: IModuleConfig = {
            components: [C1, C2],
            providers: []
        };

        @Module(moduleConfig)
        class M {}

        bootstrap(M);

        expect(initModuleSpy.calledOnce).toBeTrue();
        expect(registerComponentSpy.callCount).toEqual(1);
        expect(registerComponentSpy.getCall(0).args[0][0]).toEqual(C1);
        expect(registerComponentSpy.getCall(0).args[0][1]).toEqual(C2);
    });

    it('registerRuntimeWebComponents() should define components correctly', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);
        const customElementsDefineSpy = sandbox.spy(customElements, 'define');

        const componentConfigA: IComponentConfig = {
            selector: 'comp-a',
            template: '<div>Component A</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        const componentConfigB: IComponentConfig = {
            selector: 'comp-b',
            template: '<div>Component B</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Injectable()
        class P1 {}

        @Component(componentConfigA)
        class C1 {
            constructor(private p1: P1) {}
        }

        @Component(componentConfigB)
        class C2 {}

        const moduleConfig: IModuleConfig = {
            components: [C1, C2],
            providers: [P1]
        };

        @Module(moduleConfig)
        class M {}

        bootstrap(M);

        // C1, C2
        expect(runtimeSpy.getCustomElementClass.calledTwice).toBeTrue();
        // define calls
        expect(customElementsDefineSpy.calledTwice).toBeTrue();
        expect(customElementsDefineSpy.getCall(0).args[0]).toEqual(componentConfigA.selector);
        expect(customElementsDefineSpy.getCall(1).args[0]).toEqual(componentConfigB.selector);
    });

    it('createComponentInstance() should create component instance when the element is added to DOM', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

        @Injectable()
        class P1 {}

        @Injectable()
        class P2 {
            constructor(private p1: P1) {}
        }

        @Injectable()
        class P3 {}

        @Component({
            selector: 'test-c',
            template: '<div>Test C</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        })
        class C {
            constructor(private p3: P3) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2, P3]
        })
        class M {}

        bootstrap(M);

        document.body.insertAdjacentHTML('beforeend', '<test-c></test-c>');

        // C1
        expect(runtimeSpy.createComponentInstance.calledOnce).toBeTrue();
        expect(runtimeSpy.createComponentInstance.getCall(0).args[0]).toEqual(C);
        // P1
        expect(runtimeSpy.createProviderInstance.calledOnce).toBeTrue();
        expect(runtimeSpy.createProviderInstance.getCall(0).args[0]).toEqual(P3);
        // C1 and P3
        expect(runtimeSpy.getConstructorParamsFor.callCount).toBe(2);
        // constructor params for P3 - []
        expect(runtimeSpy.getConstructorParamsFor.returnValues[0]).toEqual([]);
        // constructor params for C - [instanceof P1]
        expect(runtimeSpy.getConstructorParamsFor.returnValues[1][0]).toBeInstanceOf(P3);
    });

    it('createProviderInstance() should create instance only if the providerClass is injected to a componentClass', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

        @Injectable()
        class P1 {}

        @Injectable()
        class P2 {
            constructor(private p1: P1) {}
        }

        @Injectable()
        class P3 {}

        @Component({
            selector: 'test-c12',
            template: '<div>Test C</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        })
        class C {
            constructor(private p3: P3) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2, P3]
        })
        class M {}

        bootstrap(M);

        document.body.insertAdjacentHTML('beforeend', '<test-c12></test-c12>');

        // only for P3
        expect(runtimeSpy.createProviderInstance.calledOnce).toBeTrue();
        expect(runtimeSpy.createProviderInstance.getCall(0).args[0]).toEqual(P3);
        // C1 and P3
        expect(runtimeSpy.getConstructorParamsFor.callCount).toBe(2);
        // constructor params for P3 - []
        expect(runtimeSpy.getConstructorParamsFor.returnValues[0]).toEqual([]);
        // constructor params for C - [instanceof P1]
        expect(runtimeSpy.getConstructorParamsFor.returnValues[1][0]).toBeInstanceOf(P3);
    });

    it('createProviderInstance() should throw exception, if the provider is not in the providers array', () => {
        @Injectable()
        class P1 {}

        @Component({
            selector: 'provider-test-exception-comp',
            template: '<div>XYZ</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        })
        class C {
            constructor(private p1: P1) {}
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        const runtime = new Runtime();

        const runtimeSpy = sandbox.spy(runtime);

        runtime.initModule(M);

        expect(() => runtimeSpy.getConstructorParamsFor(C)).toThrowError();
    });

    it('createProviderInstance() should create only one instance per providerClass', () => {
        const runtimeSpy = sandbox.spy(Runtime.prototype);

        @Injectable()
        class P1 {}

        @Injectable()
        class P2 {
            constructor(private p1: P1) {}
        }

        @Injectable()
        class P3 {
            constructor(private p2: P2, private p1: P1) {}
        }

        @Injectable()
        class P4 {
            constructor(private p1: P1, private p3: P3, private p2: P2) {}
        }

        @Component({
            selector: 'my-comp',
            template: '<div>my comp</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        })
        class C {
            constructor(private p2: P2, private p4: P4) {}
        }

        @Module({
            components: [C],
            providers: [P1, P2, P3, P4]
        })
        class M {}

        bootstrap(M);

        document.body.insertAdjacentHTML('beforeend', '<my-comp></my-comp>');

        // for each distinct injection
        expect(runtimeSpy.createProviderInstance.callCount).toEqual(4);
    });

    it('components should be initiated without errors if there is no lifecycle method', (done) => {
        const componentConfigTest: IComponentConfig = {
            selector: 'comp-test',
            template: '<div>Component Test</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfigTest)
        class C {}

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><comp-test index="0"></comp-test></div>');

        setTimeout(() => {
            const compTest = document.querySelector(componentConfigTest.selector);
            expect(compTest).not.toBe(null);
            expect((compTest as HTMLElement).innerHTML).toEqual(componentConfigTest.template);
            // change attr
            (compTest as HTMLElement).setAttribute('index', '1');
            // remove from DOM
            (compTest as HTMLElement).remove();
            //
            done();
        });
    });

    it('component` lifecycle methods should be called in order', (done) => {
        @Injectable()
        class P1 {
            sayHello(name: string): string {
                return `Hello ${name}`;
            }

            sayWelcome(changes?: IAttrChanges): unknown[] {
                return ['Welcome', changes];
            }

            sayGoodbye(name: string): string {
                return `Goodbye ${name}`;
            }
        }

        const componentConfigX: IComponentConfig = {
            selector: 'comp-x',
            template: '<div>Component X</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfigX)
        class C1 implements IOnAttrChanges, IOnPropChanges, IOnInit, IOnViewInit, IOnDestroy {
            constructor(private p1: P1) {}

            @Attr()
            index!: string;

            @Prop()
            list!: string[];

            onAttrChanges(changes?: IAttrChanges) {
                this.p1.sayWelcome(changes);
            }

            onPropChanges(changes?: IPropChanges) {
                this.p1.sayWelcome(changes);
            }

            onInit(): void {
                this.p1.sayHello('C1:onInit');
            }

            onViewInit(): void {
                this.p1.sayHello('C1:onViewInit');
            }

            onDestroy() {
                this.p1.sayGoodbye('C1:onDestroy');
            }
        }

        const moduleConfig: IModuleConfig = {
            components: [C1],
            providers: [P1]
        };

        @Module(moduleConfig)
        class M {}

        // create spies before bootstrap
        const providerSpy = sandbox.spy(P1.prototype);
        const componentSpy = sandbox.spy(C1.prototype);

        bootstrap(M);
        // addition of the component to DOM will initiate web component class instance over mapped factory class
        document.body.insertAdjacentHTML('beforeend', `<div id="comp-x-wrapper"><comp-x index="0"></comp-x></div>`);

        expect(componentSpy.onAttrChanges.callCount).toEqual(0);

        expect(componentSpy.onInit.calledOnce).toBeTrue();
        expect(providerSpy.sayHello.calledOnce).toBeTrue();

        expect(componentSpy.onInit.calledBefore(componentSpy.onViewInit)).toBeTrue();
        expect(componentSpy.onInit.calledBefore(componentSpy.onAttrChanges)).toBeTrue();

        setTimeout(() => {
            // check async viewInit callbacks
            expect(componentSpy.onViewInit.calledOnce).toBeTrue();
            expect(componentSpy.onViewInit.calledBefore(componentSpy.onAttrChanges)).toBeTrue();
            expect(providerSpy.sayHello.calledTwice).toBeTrue();

            // wait for async addition of template
            const compX = document.querySelector(componentConfigX.selector);
            expect(compX).not.toBe(null);
            expect((compX as HTMLElement).innerHTML).toEqual(componentConfigX.template);

            // trigger attr changes
            (compX as HTMLElement).setAttribute('index', '1');

            const attrChanges: IAttrChanges = {name: 'index', oldValue: '0', newValue: '1'};

            // validate changes
            expect(componentSpy.onAttrChanges.calledOnce).toBeTrue();
            expect(componentSpy.onAttrChanges.getCall(0).args[0]).toEqual(attrChanges);

            expect(providerSpy.sayWelcome.calledOnce).toBeTrue();
            expect(providerSpy.sayWelcome.getCall(0).args[0]).toEqual(attrChanges);

            // trigger prop changes
            (compX as any).list = ['test'];

            const propChanges: IPropChanges = {name: 'list', oldValue: undefined, newValue: ['test']};

            // validate changes
            expect(componentSpy.onPropChanges.calledOnce).toBeTrue();
            expect(componentSpy.onPropChanges.getCall(0).args[0]).toEqual(propChanges);

            expect(providerSpy.sayWelcome.calledTwice).toBeTrue();
            expect(providerSpy.sayWelcome.getCall(1).args[0]).toEqual(propChanges);

            // remove the element to trigger onDestroy
            (compX as HTMLElement).remove();

            // validate other lifecycle method's total call counts
            expect(componentSpy.onInit.calledOnce).toBeTrue();
            expect(componentSpy.onViewInit.calledOnce).toBeTrue();
            expect(componentSpy.onAttrChanges.calledOnce).toBeTrue();

            // validate destroy
            expect(componentSpy.onDestroy.calledOnce).toBeTrue();
            expect(providerSpy.sayGoodbye.calledOnce).toBeTrue();

            // call done since the test is async
            done();
        }, 0);
    });

    it('should assign props correctly', () => {
        const componentConfig: IComponentConfig = {
            selector: 'my-prop-assign-comp',
            template: '<div>My Prop Assign Comp</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfig)
        class C implements IOnPropChanges {
            @Prop()
            private test!: string;

            @Prop()
            private arr!: string[];

            onPropChanges(changes?: IPropChanges) {
                //
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<my-prop-assign-comp></my-prop-assign-comp>');

        const componentSpy = sandbox.spy(C.prototype);

        const elementInDom = document.querySelector(componentConfig.selector);
        (elementInDom as any).test = 'test';

        expect(componentSpy.onPropChanges.calledOnce).toBeTrue();
        expect(componentSpy.onPropChanges.getCall(0).args[0]).toEqual({
            name: 'test',
            oldValue: undefined,
            newValue: 'test'
        });

        (elementInDom as any).arr = ['test'];

        expect(componentSpy.onPropChanges.calledTwice).toBeTrue();
        expect(componentSpy.onPropChanges.getCall(1).args[0]).toEqual({
            name: 'arr',
            oldValue: undefined,
            newValue: ['test']
        });
    });

    it('onAttrChanges() should not be triggered if there is no component attr', () => {
        const componentConfig: IComponentConfig = {
            selector: 'no-attr-comp',
            template: '<div>No Attr Comp</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfig)
        class C implements IOnAttrChanges {
            onAttrChanges(changes?: IAttrChanges) {
                //
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><no-attr-comp index="0"></no-attr-comp></div>');

        expect(componentSpy.onAttrChanges.callCount).toEqual(0);
    });

    it('onPropChanges() should not be triggered if there is no component prop', () => {
        const componentConfig: IComponentConfig = {
            selector: 'no-prop-comp',
            template: '<div>No Prop Comp</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(componentConfig)
        class C implements IOnPropChanges {
            onPropChanges(changes?: IAttrChanges) {
                //
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><no-prop-comp></no-prop-comp></div>');

        expect(componentSpy.onPropChanges.callCount).toEqual(0);
    });

    it('should not trigger onAttrChanges() and / or onPropChanges() if the changed attr / prop is not listened in component', () => {
        // todo
    });

    it('nested component initiations should be from outer to inner', (done) => {
        const innerConfig: IComponentConfig = {
            selector: 'comp-inner',
            template: '<div>Inner Comp</div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };
        const middleConfig: IComponentConfig = {
            selector: 'comp-middle',
            template: '<div><comp-inner></comp-inner></div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };
        const outerConfig: IComponentConfig = {
            selector: 'comp-outer',
            template: '<div><comp-middle></comp-middle></div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(innerConfig)
        class CInner implements IOnInit, IOnDestroy {
            onInit() {
                //
            }
            onDestroy() {
                //
            }
        }

        @Component(middleConfig)
        class CMiddle implements IOnInit, IOnDestroy {
            onInit() {
                //
            }
            onDestroy() {
                //
            }
        }

        @Component(outerConfig)
        class COuter implements IOnInit, IOnDestroy {
            onInit() {
                //
            }
            onDestroy() {
                //
            }
        }

        @Module({
            components: [COuter, CMiddle, CInner],
            providers: []
        })
        class M {}

        bootstrap(M);

        const outerSpy = sandbox.spy(COuter.prototype);
        const middleSpy = sandbox.spy(CMiddle.prototype);
        const innerSpy = sandbox.spy(CInner.prototype);
        // add to DOM
        document.body.insertAdjacentHTML('beforeend', '<div><comp-outer></comp-outer></div>');
        // async check due to insertHTML async call
        setTimeout(() => {
            // inner check
            expect(outerSpy.onInit.calledOnce).toBeTrue();
            expect(outerSpy.onInit.calledBefore(middleSpy.onInit)).toBeTrue();
            expect(outerSpy.onInit.calledBefore(innerSpy.onInit)).toBeTrue();
            // middle check
            expect(middleSpy.onInit.calledOnce).toBeTrue();
            expect(middleSpy.onInit.calledBefore(innerSpy.onInit)).toBeTrue();
            // outer
            expect(innerSpy.onInit.calledOnce).toBeTrue();
            // remove
            const outer = document.querySelector(outerConfig.selector);
            (outer as HTMLElement).remove();
            // check onDestroy
            // outer
            expect(outerSpy.onDestroy.calledOnce).toBeTrue();
            expect(outerSpy.onDestroy.calledBefore(middleSpy.onDestroy)).toBeTrue();
            expect(outerSpy.onDestroy.calledBefore(innerSpy.onDestroy)).toBeTrue();
            // middle
            expect(middleSpy.onDestroy.calledOnce).toBeTrue();
            expect(middleSpy.onDestroy.calledBefore(innerSpy.onDestroy)).toBeTrue();
            // inner
            expect(innerSpy.onDestroy.calledOnce).toBeTrue();

            done();
        }, 50); // 50ms to make sure all init views are done
    });

    it('component instances for same components with different usage should be isolated ', (done) => {
        const config: IComponentConfig = {
            selector: 'isolated-comp',
            template: '<div></div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(config)
        class C implements IOnInit, IOnDestroy, IOnAttrChanges {
            @Attr()
            private index!: string;

            onAttrChanges(changes: IAttrChanges) {
                this.getIndex();
            }

            onInit() {
                this.getIndex();
            }

            onDestroy() {
                //
            }

            getIndex(): string {
                return this.index;
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);

        document.body.insertAdjacentHTML(
            'beforeend',
            `<div id="c-1"><isolated-comp index="0"></isolated-comp></div>
                   <div id="c-2"><isolated-comp index="1"></isolated-comp></div>`
        );

        setTimeout(() => {
            expect(componentSpy.onInit.callCount).toEqual(2);
            expect(componentSpy.getIndex.callCount).toEqual(2);
            expect(componentSpy.getIndex.getCall(0).returnValue).toEqual('0');
            expect(componentSpy.getIndex.getCall(1).returnValue).toEqual('1');
            // trigger change in first comp
            const firstComp = document.querySelector(`#c-1 > ${config.selector}`);
            (firstComp as HTMLElement).setAttribute('index', '-1');

            expect(componentSpy.onAttrChanges.calledOnce).toBeTrue();
            expect(componentSpy.getIndex.callCount).toEqual(3);
            expect(componentSpy.getIndex.getCall(2).returnValue).toEqual('-1');

            // trigger change in second comp
            const secondComp = document.querySelector(`#c-2 > ${config.selector}`);
            (secondComp as HTMLElement).setAttribute('index', '-2');

            expect(componentSpy.onAttrChanges.calledTwice).toBeTrue();
            expect(componentSpy.getIndex.callCount).toEqual(4);
            expect(componentSpy.getIndex.getCall(3).returnValue).toEqual('-2');

            // delete first comp
            (firstComp as HTMLElement).remove();

            expect(componentSpy.onDestroy.calledOnce).toBeTrue();

            // delete second comp
            (secondComp as HTMLElement).remove();

            expect(componentSpy.onDestroy.calledTwice).toBeTrue();

            done();
        });
    });

    it('attr field types should be converted correctly', () => {
        const config: IComponentConfig = {
            selector: 'attr-test-comp',
            template: '<div></div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(config)
        class C implements IOnAttrChanges {
            @Attr()
            private index!: number;

            onAttrChanges(changes: IAttrChanges) {
                //
            }

            getIndex() {
                return this.index;
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);

        document.body.insertAdjacentHTML('beforeend', `<div><attr-test-comp index="0"></attr-test-comp></div>`);

        const componentInDOM: HTMLElement | null = document.querySelector('attr-test-comp');
        (componentInDOM as HTMLElement).setAttribute('index', '1');

        expect(componentSpy.onAttrChanges.calledOnce).toBeTrue();
        expect(componentSpy.onAttrChanges.getCall(0).args[0]).toEqual({
            name: 'index',
            oldValue: 0,
            newValue: 1
        });
    });

    it('view container should be assigned correctly', (done) => {
        const config: IComponentConfig = {
            selector: 'view-container-test-comp',
            template: '<div></div>',
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(config)
        class C implements IOnViewInit {
            @ViewContainer()
            hostElement!: HTMLElement;

            onViewInit() {
                this.appendContentToHostElement();
            }

            appendContentToHostElement() {
                const testDiv = document.createElement('div');
                testDiv.className = 'test';
                this.hostElement?.appendChild(testDiv);
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);

        document.body.insertAdjacentHTML('beforeend', `<view-container-test-comp></view-container-test-comp>`);

        setTimeout(() => {
            expect(componentSpy.onViewInit.calledOnce).toBeTrue();
            const componentInDOM: HTMLElement | null = document.querySelector(config.selector);
            const testDiv = componentInDOM?.querySelector('.test');
            expect(testDiv).toBeTruthy();
            done();
        }, 200);
    });

    it('view children should be assigned correctly', (done) => {
        const config: IComponentConfig = {
            selector: 'view-children-test-comp',
            template: `
              <div class="test">
                <span class="test-many"></span>
                <span class="test-many"></span>
                <span class="test-many"></span>
              </div>
            `,
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(config)
        class C implements IOnViewInit {
            @ViewChild('.test')
            testChild!: HTMLElement;

            @ViewChild('.test-many')
            testChildren!: HTMLElement[];

            @ViewChild('.does-not-exist')
            doesNotExistChild!: HTMLElement | null;

            onViewInit() {
                this.getTestChild();
                this.getTestChildren();
                this.getDoesNotExistChild();
            }

            getTestChild() {
                return this.testChild;
            }

            getTestChildren() {
                return this.testChildren;
            }

            getDoesNotExistChild() {
                return this.doesNotExistChild;
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);

        document.body.insertAdjacentHTML('beforeend', `<view-children-test-comp></view-children-test-comp>`);

        setTimeout(() => {
            expect(componentSpy.getTestChild.calledOnce).toBeTrue();
            expect(componentSpy.getTestChildren.calledOnce).toBeTrue();
            expect(componentSpy.getDoesNotExistChild.calledOnce).toBeTrue();

            const componentInDOM: HTMLElement | null = document.querySelector(config.selector);
            const child = componentInDOM?.querySelector('.test');
            const children = componentInDOM?.querySelectorAll('.test-many');

            expect(componentSpy.getTestChild.getCall(0).returnValue).toEqual(child as HTMLElement);

            expect(componentSpy.getTestChildren.getCall(0).returnValue).toEqual(
                Array.from(children as NodeListOf<HTMLElement>)
            );
            expect(componentSpy.getDoesNotExistChild.getCall(0).returnValue).toEqual(null);

            done();
        }, 200);
    });

    it('event listeners should be set correctly', (done) => {
        const config: IComponentConfig = {
            selector: 'event-listener-test-comp',
            template: `<button class="test"></button><button class="test2"></button>`,
            viewEncapsulation: ViewEncapsulation.NONE
        };

        @Component(config)
        class C {
            @Listen('click', '.test')
            onClick(event: Event, element: HTMLElement) {
                return element;
            }

            @Listen('click', '.test2', () => false)
            dontListenClick() {
                return 'no callback';
            }

            @Listen('click')
            hostClickListener() {
                return 'host listener';
            }
        }

        @Module({
            components: [C],
            providers: []
        })
        class M {}

        bootstrap(M);

        const componentSpy = sandbox.spy(C.prototype);

        document.body.insertAdjacentHTML('beforeend', `<event-listener-test-comp></event-listener-test-comp>`);

        setTimeout(() => {
            const componentInDOM: HTMLElement | null = document.querySelector(config.selector);
            componentInDOM?.click();
            expect(componentSpy.hostClickListener.callCount).toEqual(1);
            expect(componentSpy.hostClickListener.getCall(0).returnValue).toEqual('host listener');

            const child = componentInDOM?.querySelector('.test');
            (child as HTMLButtonElement)?.click();
            expect(componentSpy.onClick.callCount).toEqual(1);
            expect(componentSpy.onClick.getCall(0).returnValue).toEqual(child as HTMLElement);

            const child2 = componentInDOM?.querySelector('.test2');
            (child2 as HTMLButtonElement)?.click();
            expect(componentSpy.dontListenClick.callCount).toEqual(0);

            done();
        }, 200);
    });

    it('should add the styles correctly based on shadow flag', (done) => {
        const config1: IComponentConfig = {
            selector: 'style-test-comp',
            template: '<div class="test"></div>',
            viewEncapsulation: ViewEncapsulation.NONE,
            styles: [
                `
                .test {
                    background-color: rgb(255, 255, 255);
                }
                `
            ]
        };

        const config2: IComponentConfig = {
            selector: 'style-test-shadow-comp',
            template: '<div class="test"></div>',
            viewEncapsulation: ViewEncapsulation.SHADOW_DOM,
            styles: [
                `
                    .test {
                        background-color: rgb(0, 0, 0);
                    }
                `
            ]
        };

        const config3: IComponentConfig = {
            selector: 'no-style-test-shadow-comp',
            template: '<div class="test"></div>',
            viewEncapsulation: ViewEncapsulation.SHADOW_DOM,
            styles: []
        };

        @Component(config1)
        class C1 {}

        @Component(config2)
        class C2 {}

        @Component(config3)
        class C3 {}

        @Module({
            components: [C1, C2, C3],
            providers: []
        })
        class M {}

        bootstrap(M);

        document.body.insertAdjacentHTML(
            'beforeend',
            `
          <style-test-comp></style-test-comp>
          <style-test-shadow-comp></style-test-shadow-comp>
          <no-style-test-shadow-comp></no-style-test-shadow-comp>
        `
        );

        setTimeout(() => {
            const component1InDOM: HTMLElement | null = document.querySelector(config1.selector);
            const component2InDOM: HTMLElement | null = document.querySelector(config2.selector);
            const component3InDOM: HTMLElement | null = document.querySelector(config3.selector);

            const child1 = component1InDOM?.querySelector('.test');
            const style1 = component1InDOM?.querySelector('style');
            expect(style1).toBeTruthy();
            expect(window.getComputedStyle(child1 as HTMLElement).backgroundColor).toEqual('rgb(255, 255, 255)');

            const child2 = component2InDOM?.shadowRoot?.querySelector('.test');
            const style2 = component2InDOM?.shadowRoot?.querySelector('style');
            expect(child2).toBeTruthy();
            expect(style2).toBeTruthy();
            expect(window.getComputedStyle(child2 as HTMLElement).backgroundColor).toEqual('rgb(0, 0, 0)');

            const child3 = component3InDOM?.shadowRoot?.querySelector('.test');
            const style3 = component3InDOM?.shadowRoot?.querySelector('style');
            expect(child3).toBeTruthy();
            expect(style3).toBeFalsy();

            done();
        }, 200);
    });
});
