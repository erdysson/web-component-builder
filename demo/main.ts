// needed for IE11
import 'core-js/stable';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
// needed for es5 compatibility
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import {bootstrap} from '../src/core/bootstrap';
import {AppModule} from './app.module';

bootstrap(AppModule);
