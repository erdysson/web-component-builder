// needed for older browsers
import 'core-js/stable';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';

import {bootstrap} from '../core/bootstrap';
import {Module} from '../core/decorators';

import {AppComponent} from './components/app/app.component';
import {LoadingComponent} from './components/loading/loading.component';
import {TestComponent} from './components/test/test.component';
import {LogService} from './services/log.service';
import {TestService} from './services/test.service';

@Module({
    components: [AppComponent, LoadingComponent, TestComponent],
    providers: [TestService, LogService]
})
export class BuiltInModule {}

export function useBuiltIns(): void {
    bootstrap(BuiltInModule);
}
