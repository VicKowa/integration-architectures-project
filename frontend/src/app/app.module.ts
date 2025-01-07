import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { SalesmanDetailsComponent } from './pages/salesman-details-page/salesman-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CreateEvaluationComponent } from '@app/pages/create-evaluation/create-evaluation.component';
import {SalesmanValuconComponent} from '@app/pages/salesman-valucon-page/salesman-valucon.component';
import { SalesmanTableComponent } from './components/salesman-table/salesman-table.component';
import { ListEvaluationComponent } from '@app/pages/list-evaluation/list-evaluation.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SalesmanRegisterComponent } from "@app/salesman-register-page/salesman-register-page.component";

// Import for Chart.js Angular wrapper
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        ExamplePageComponent,
        NotFoundPageComponent,
        TestPageComponent,
        SalesmanDetailsComponent,
        CreateEvaluationComponent,
        SalesmanValuconComponent,
        SalesmanTableComponent,
        ListEvaluationComponent,
        SalesmanRegisterComponent
    ],
    imports: [
        BrowserModule,
        AppRouting,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatTabsModule,
        MatSortModule,
        BaseChartDirective,
        MatPaginatorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
