import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService, UserService, AlertService } from '../../_services';
import { User } from '../../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';

const URL = 'http://localhost:3000/users/profileupload';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  currentUser: User;
  public disable: boolean = true;
  userUpdateForm: FormGroup;
  submitted = false;

  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.authenticationService.currentUser.subscribe(loginUser => {
      console.log("loginUser['data']------>", loginUser['data']);
      if (loginUser['data']) {
        this.currentUser = loginUser['data'];
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {

    this.userUpdateForm = this.formBuilder.group({
      id: [this.currentUser.id],
      username: [''],
      firstName: [''],
      lastName: [''],
      profile: ['']
    });

    this.getLoginUserData();

    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    //      console.log('ImageUpload:uploaded:', item, status, response);
    //      alert('File uploaded successfully');
    //  };
  }

  get f() { return this.userUpdateForm.controls; }
  public activeInputField() {
    // this.disable = false;
    this.disable = !this.disable;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.disable) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userUpdateForm.invalid) {
      console.warn(this.userUpdateForm.value);
      return;
    }
    const formData = new FormData();
    formData.append('file', this.userUpdateForm.get('profile').value);
    // console.log('this.userUpdateForm.value---------------->', this.userUpdateForm.value);
    this.userService.update(this.userUpdateForm.value)
      .subscribe(
        data => {
          this.getLoginUserData();
          this.router.navigate(['/user-profile']);
        },
        error => {
          this.alertService.error(error);
        });
  }


  getLoginUserData() {
      this.userService.getById(this.currentUser.id).subscribe(loginUser => {
        if (loginUser['user']) {
          this.currentUser = loginUser['user'];
        }
      });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userUpdateForm.get('profile').setValue(file);
    }
  }
}
