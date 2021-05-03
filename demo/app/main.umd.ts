import 'core-js/stable';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import '@webcomponents/shadydom';
// import '@webcomponents/shadycss/scoping-shim.min';

import {bootstrap} from 'web-component-builder';

import {MainModule} from './main.module';
// bootstrap module
bootstrap(MainModule);
