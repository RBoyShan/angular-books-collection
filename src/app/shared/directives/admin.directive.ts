import { Directive, TemplateRef, ViewContainerRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/session/state/session.service';
import { SessionQuery } from 'src/app/session/state/session.query';
import { UserAuthService } from '../services/user-auth.service';
import { map, take } from 'rxjs/operators';

@Directive({
  selector: '[showIfAdmin]'
})
export class AdminDirective implements OnDestroy {
  private subscription: Subscription;
  @Input() showIfAdmin: boolean;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: UserAuthService,
  ) { }

  ngOnInit(): void {
    this.auth.user$.pipe(
      take(1),
      map(user => user && user.roles.admin ? true : false),
    ).subscribe(isAdmin => {
      this.viewContainer.clear();
      if (isAdmin) {
        if (this.showIfAdmin) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } else {
        if (this.showIfAdmin) {
          this.viewContainer.clear();
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      }
     });      
  }

  ngOnDestroy(): void {

  }
}
