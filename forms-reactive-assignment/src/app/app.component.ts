import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  projectForm: FormGroup;

  ngOnInit() {
    this.projectForm = new FormGroup({
      'projectData' : new FormGroup ({
        'projectname' : new FormControl(null, [
          Validators.required
        ], this.validateProjectName),
        'email' : new FormControl (null, [
          Validators.required,
          Validators.email
        ])
      }),
      'status' : new FormControl('Stable')
    });
  }

  validateProjectName(control: FormControl) 
    : Promise<any> | Observable<any> {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if(control.value === 'Test') {
            resolve({'invalidProjectName': true});
          } else {
            resolve(null);
          }
        }, 1500);
      })
      return promise;
  }

  onSubmit() {
    console.log(this.projectForm.value);
  }
}
