import 'web-component-builder/dist/main.css';
import {useBuiltIns} from 'web-component-builder';
import {bootstrap} from 'web-component-builder/dist/main/lib/core/bootstrap';

import {MainModule} from './main.module';

useBuiltIns();

bootstrap(MainModule);
