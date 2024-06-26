import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UserComponent } from './pages/user/user.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RecuperNomeComponent } from './pages/recuper-nome/recuper-nome.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecuperarsenhaComponent } from './pages/recuperarsenha/recuperarsenha.component';
import { RedefinirsenhaComponent } from './pages/redefinirsenha/redefinirsenha.component';
import { ShoplistComponent } from './pages/shoplist/shoplist.component';
import { AddStockDialogComponent } from './pages/admin/add-stock-dialog/add-stock-dialog.component';
import { EstoqueUnrakedComponent } from './pages/admin/estoque-unraked/estoque-unraked.component';
import { EstoqueEloComponent } from './pages/admin/estoque-elo/estoque-elo.component';
import { MenuDashboardComponent } from './pages/admin/menu-dashboard/menu-dashboard.component';
import { EstoquePbeComponent } from './pages/admin/estoque-pbe/estoque-pbe.component';
import { ConstrucaoComponent } from './pages/construcao/construcao.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    AdminComponent,
    UserComponent,
    HomeComponent,
    NotFoundComponent,
    RecuperNomeComponent,
    RegisterComponent,
    LoginComponent,
    CartComponent,
    RecuperarsenhaComponent,
    RedefinirsenhaComponent,
    ShoplistComponent,
    AddStockDialogComponent,
    EstoqueUnrakedComponent,
    EstoqueEloComponent,
    MenuDashboardComponent,
    EstoquePbeComponent,
    ConstrucaoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    MatDialogModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ],
})

export class AppModule { }
