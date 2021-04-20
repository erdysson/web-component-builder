import {Component, IOnInit, Prop} from 'web-component-builder';

@Component({
    selector: 'app-test',
    template: '<div>Hey There</div>'
})
export class Test implements IOnInit {
    @Prop()
    propFromParent!: string[];

    onInit(): void {
        console.log('app-test on init');
    }
}
