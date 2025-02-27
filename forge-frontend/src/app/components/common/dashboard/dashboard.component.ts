import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/Account.model';
import { AccountOverview } from 'src/app/models/AccountOverview';
import { Asset } from 'src/app/models/Asset.model';
import { Expense } from 'src/app/models/Expense.model';
import { Settings } from 'src/app/models/Settings.model';
import { Stock } from 'src/app/models/Stock.model';
import { StockOverview } from 'src/app/models/StockOverview';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  assets: Asset[];
  currentSettings: Settings;
  
  stock_overview: StockOverview[] = [];
  account_overview: AccountOverview[] = [];

  constructor(public db:DatabaseService) {
    this.assets = [];
    this.currentSettings = new Settings();
  }

  ngOnInit(): void {
    this.db.settings.subscribe(
      (data:Settings) => {
        this.currentSettings = data;
      }
    )
    this.db.stock_overview.subscribe(
      (data) => {
        this.stock_overview = data;
      }
    )
    this.db.account_overview.subscribe(
      (data) => {
        this.account_overview = data;
      }
    )
  }


  get_total_money_in_banks(){
    var currentBalance = 0;
    for(let i=0;i<this.account_overview.length;i++){
      currentBalance += this.account_overview[i].amount;
    }
    return currentBalance;
  }
  
  get_total_money_in_investments(){
    var currentBalance = 0;
    for(let i=0;i<this.stock_overview.length;i++){
      currentBalance += this.stock_overview[i]['amount'] * this.stock_overview[i]['price'];
    }
    return currentBalance;
  }

  get_total_net_worth(){
    var result = this.get_total_money_in_banks() + this.get_total_money_in_investments();
    result = Math.round(result* 100) / 100;
    return result;
  }

  format_amount(amount:number){
    var negative = amount < 0;
    amount = Math.abs(amount);
    var formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.get_viewing_currency()!,
    });
    if(negative){
      return '-' + formatter.format(+amount.toFixed(2)).substring(1);  
    }
    return formatter.format(+amount.toFixed(2)).substring(1);
  }

  get_viewing_currency() {
    if (localStorage.getItem("View_Currency") == null) {
      return "INR";
    }
    return localStorage.getItem("View_Currency");
  }
}
