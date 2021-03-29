import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
console.log('test');
import {bootstrap} from '../src/core/bootstrap';
import {AppModule} from './app.module';

bootstrap(AppModule);
