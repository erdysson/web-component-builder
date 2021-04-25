import {Component, Module} from './decorators';
import {IOnInit} from './interfaces';

@Component({
    selector: 'a',
    template: ''
})
export class A implements IOnInit {
    onInit() {
        console.log('on init');
    }
}

@Module({
    components: [A],
    providers: []
})
export class TestModule {}
