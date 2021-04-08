import {Component} from '../../../core/decorators';

import testTemplate from './test.component.html';
import './test.component.scss';

@Component({
    selector: 'test-component',
    template: testTemplate
})
export class TestComponent {}
