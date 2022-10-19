import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { HttpClientModule } from "@angular/common/http";
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';

@NgModule({
    declarations: [
        AppComponent,
        SideMenuComponent,
        TopMenuComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GoogleMapsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
