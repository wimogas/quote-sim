import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {QuoteService} from "../services/quote.service";

@Injectable({
  providedIn: 'root'
})
export class QuoteListResolverService implements Resolve<any>{

  constructor(
    private quoteService: QuoteService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<any> {
    return this.quoteService.fetchQuoteList();
  }
}
