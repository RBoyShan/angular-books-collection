import { Directive, OnDestroy, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionQuery } from 'src/app/session/state/session.query';

@Directive({ selector: '[showIfLoggedIn]' })
export class ShowIfLoggedInDirective implements OnDestroy {
  
  private subscription: Subscription;
  @Input() showIfLoggedIn: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sessionQuery: SessionQuery
  ) {
  }

  ngOnInit() {
    this.subscription = this.sessionQuery.isLoggedIn$.subscribe(isLoggedIn => {
      this.viewContainer.clear();
      if (isLoggedIn) {
        if (this.showIfLoggedIn) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } else {
        if (this.showIfLoggedIn) {
          this.viewContainer.clear();
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}