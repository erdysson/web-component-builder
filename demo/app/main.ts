import 'core-js/stable';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
// import LogRocket from 'logrocket';
import {bootstrap} from 'web-component-builder';

import {MainModule} from './main.module';
// init monitoring for app performance
// LogRocket.init('jr8nqw/web-component-builder');
// bootstrap module
bootstrap(MainModule);
