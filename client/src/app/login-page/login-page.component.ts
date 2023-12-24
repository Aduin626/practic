import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MyTokenPayload } from '../shared/interfaces';
import { jwtDecode } from 'jwt-decode';
import 'tslib';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  form!: FormGroup;
  aSub!: Subscription;
  registrationError: string | null = null; // Variable to hold registration error message
  applicationSubmitted: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        this.applicationSubmitted = true;
      } else if (params['']) {
        this.applicationSubmitted = false;
      }
    });
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe(
      (response) => {
        console.log(this.form.value);
        const token = response.token;
        if (token) {
          const decodedToken: MyTokenPayload = jwtDecode(token);
          console.log(decodedToken);
          const userRole = decodedToken.roleid;

          switch (userRole) {
            case 1:
              this.router.navigate(['/admin-dashboard']);
              break;
            case 2:
              this.router.navigate(['/client-dashboard']);
              break;

            default:
              this.router.navigate(['/']);
              break;
          }
        }
      },
      (error) => {
        console.log(error.error);
        if (error && error.error && error.error.error) {
          this.registrationError = error.error.error;
        } else {
          this.registrationError = 'An error occurred during registration.';
        }
        this.form.enable();
      }
    );
  }
}
