import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../shared/services/application.service';
@Component({
  selector: 'app-application-page',
  templateUrl: './application-page.component.html',
  styleUrls: ['./application-page.component.css'],
})
export class ApplicationPageComponent {
  form!: FormGroup;
  aSub!: Subscription;
  registrationError: string | null = null;

  constructor(
    private appicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl('Физическое', Validators.required),
      contactinfo: new FormControl(null, Validators.required),
      contractnumber: new FormControl(null, Validators.required),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      organizationname: new FormControl(null),
    });
  }

  onSubmit(): void {
    this.form.disable();
    this.registrationError = null;
    console.log(this.form.value);

    this.aSub = this.appicationService
      .createApplication(this.form.value)
      .subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['/login'], {
            queryParams: {
              registered: true,
            },
          });
        },
        (error) => {
          console.error(error);
          if (error && error.error && error.error.error) {
            this.registrationError = 'Данные введены некоректно';
          } else {
            this.registrationError =
              'An error occurred during application submission.';
          }
          this.form.enable();
        }
      );
  }
}
