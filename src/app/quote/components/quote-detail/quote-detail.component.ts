import {Component, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from "@angular/router";
import {QuoteService} from "../../services/quote.service";
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {IQuote} from "../../models/quote.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrl: './quote-detail.component.scss'
})
export class QuoteDetailComponent implements OnInit {
  quote?: IQuote;
  tiers: string[] = ['basic', 'premium', 'enterprise']
  changesSaved: boolean = false;
  quoteForm!: FormGroup
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quoteService: QuoteService) {
    this.quoteForm = new FormGroup<any>({
      quoteName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      tier: new FormControl('', Validators.required),
      extras: new FormArray([])
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      const foundQuote = this.quoteService.getQuoteById(data['id'])
      if (foundQuote) {
        this.quote = foundQuote
        this.quoteForm.get('quoteName')?.setValue(foundQuote.name)
        this.quoteForm.get('tier')?.setValue(foundQuote.tier)
        if (foundQuote.extras) {
          foundQuote.extras.forEach(extra => {
            this.addExtra(extra);
          });
        }
      } else {
        this.router.navigate(['/quotes'])
      }
    })
  }

  updateQuote() {
    if (this.quote) {
      this.changesSaved = true
      this.quote.name = this.quoteForm.value.quoteName
      this.quote.tier = this.quoteForm.value.tier
      this.quote.extras = this.quoteForm.value.extras

      this.quoteService.updateQuote(this.quote).subscribe({
        next: () => this.router.navigate(['/quotes']),
        error: (err) => console.log(err)
      })

    }
  }

  get extras(): FormArray {
    return this.quoteForm.get('extras') as FormArray
  }

  addExtra(value: string) {
    this.extras.push(new FormControl(value))
  }

  removeExtra(i: number) {
    this.extras.removeAt(i)
  }
}
