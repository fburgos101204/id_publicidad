import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service'
import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  content: string = '';
  value: any;
  userInfo: any;
  deletecookie: any;
  useremail: string = '';
  userpassword: string = '';
  loggedIn: boolean = true;
  show: boolean = false;
  loginFail: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard'])
    }
  }

  ShowPassword() {
    this.show = !this.show
  }

  SignIn(phonenumber: string, userpassword: string) {
    this.loginFail = false
    let host = window.location.hostname
    this.loginService.userLog(phonenumber, userpassword).subscribe({
      next: (res) => {
        let token: any = res
        if (token.error != true) {
          console.log('Entre aqui ' + token.error)
          localStorage.setItem('token', token.token)
          localStorage.setItem('rol', token.rol)
          console.log(res)
          //this.router.navigate(['/dashboard'])
          this.router.navigate(['/dashboard'])
          .then(() => {
            window.location.reload();
          });
          //location.reload();
          //window.location.href = host+"/#/dashboard";
        } else {
          this.loginFail = true
          console.log('Tamo aqui')
          console.log('You shall not pass!!!')
        }
      },
      error: (error) => {
        this.loginFail = true
        console.log('por aqui')
        console.log('Error: ')
        console.log('You stink')
        console.log(error)
      },
    })
  }


  ngOnDestroy() {
  }

}
