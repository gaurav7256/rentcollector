import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

import { AuthenticationService, UserService } from '../../_services';
import { User } from '../../_models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  currentUser: User;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.location = location;
    this.authenticationService.currentUser.subscribe(loginUser => {
      if (loginUser['data']) {
        this.currentUser = loginUser['data'];
      } else {
        this.router.navigate(['/login']);
      }
    });

  }



  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.getLoginUserData();
  }
  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(2);
    }
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

getLoginUserData() {
    // setInterval(() => {
      this.userService.getById(this.currentUser.id).subscribe(loginUser => {
        if (loginUser['user']) {
          this.currentUser = loginUser['user'];
        }
      });
    // }, 1000);
  }

}
