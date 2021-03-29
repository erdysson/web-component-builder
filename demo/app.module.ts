import {Module} from '../src/core/decorators';
import {TestService} from './services/test.service';
import {LogService} from './services/log.service';
import {AppComponent} from './components/app/app.component';

@Module({
    components: [AppComponent],
    providers: [TestService, LogService]
})
export class AppModule {}
