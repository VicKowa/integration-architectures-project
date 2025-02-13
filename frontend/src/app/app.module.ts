import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { SalesmanListPageComponent } from '@app/pages/salesman-list-page/salesman-list-page.component';
import { SalesmanDetailsComponent } from './pages/salesman-details-page/salesman-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SalesmanRegisterComponent } from '@app/pages/salesman-register-page/salesman-register-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateEvaluationComponent } from '@app/pages/create-evaluation/create-evaluation.component';
import { SalesmanValuconComponent } from '@app/pages/salesman-valucon-page/salesman-valucon.component';
import { SalesmanTableComponent } from './components/salesman-table/salesman-table.component';
import { ListEvaluationComponent } from '@app/pages/list-evaluation/list-evaluation.component';
import { MatPaginatorModule } from '@angular/material/paginator';

// Import for Chart.js Angular wrapper
import { BaseChartDirective } from 'ng2-charts';
import { SalesmanValuconListPageComponent } from './pages/salesman-valucon-list-page/salesman-valucon-list-page.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { AuthService } from './services/auth.service';

export const initializeApp = (authService: AuthService): (() => Promise<HttpResponse<any>>) =>
    (): Promise<HttpResponse<{
        loggedIn: boolean;
    }>> => authService.checkLogin().toPromise();

@NgModule({ declarations: [
        AppComponent,
        LoginPageComponent,
        LoginComponent,
        LandingPageComponent,
        MenuBarComponent,
        NotFoundPageComponent,
        SalesmanListPageComponent,
        SalesmanDetailsComponent,
        CreateEvaluationComponent,
        SalesmanValuconComponent,
        SalesmanTableComponent,
        ListEvaluationComponent,
        SalesmanRegisterComponent,
        SalesmanValuconListPageComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRouting,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatTabsModule,
        MatSortModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatChipsModule,
        BaseChartDirective,
        CommonModule,
        NgOptimizedImage,
        FormsModule], providers: [
        provideAppInitializer(() => {
        const initializerFn = (initializeApp)(inject(AuthService));
        return initializerFn();
      }),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
