import {Module, RouterModule} from 'web-component-builder';

import {appRoutes} from './app-routes';
import {App} from './components/app';
import {Home} from './components/home';
import {Person} from './components/person';
import {Profile} from './components/profile';
import {AppService} from './services/app.service';
import {PersonGuard} from './services/person.guard';

@Module({
    imports: [RouterModule.withConfig(appRoutes)],
    components: [App, Home, Profile, Person],
    providers: [AppService, PersonGuard]
})
export class MainModule {}
