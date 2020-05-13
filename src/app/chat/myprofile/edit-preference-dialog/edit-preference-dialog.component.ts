import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';
import { NgxNotificationService } from 'ngx-kc-notification';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-edit-preference-dialog',
  templateUrl: './edit-preference-dialog.component.html',
  styleUrls: ['./edit-preference-dialog.component.css']
})
export class EditPreferenceDialogComponent implements OnInit {
  data: any;
  preferenceData: any;
  maxHeight: any;
  minHeight: any;
  gender;
  casteo: Observable<string[]>;
  getcastes: any = [];


  // tslint:disable-next-line: max-line-length
  Heights: string[] = ['4\'0"', '4\'1"', '4\'2"', '4\'3"', '4\'4"', '4\'5"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"', '6\'6"', '6\'7"', '6\'8"', '6\'9"', '6\'10"', '6\'11"', '7\'0"'];
  // tslint:disable-next-line: max-line-length
  Heights1: string[] = ['48', '49', '50', '51', '52', '53', '54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84'];
  Mangalika = ['Manglik', 'Non-Manglik', 'Anshik Manglik', 'Doesn\'t Matter'];
  Foodpreferences: string[] = ['Doesn\'t Matter', 'Non-Vegetarian', 'Vegetarian'];
  Working: string[] = ['Working', 'Not Working', 'Doesn\'t Matter'];
  Occupation: string[] = ['Private Job', 'Business/Self-Employed', 'Govt Job', 'Doctor', 'Teacher', 'Doesn\'t Matter',
  'Defence', 'Civil Services'];
  MaritalStatus: string[] = ['Doesn\'t Matter', 'Never Married', 'Awaiting Divorce', 'Divorcee', 'Widowed', 'Anulled'];
  @ViewChild('preferencesForm', {static: false}) preferenceForm: NgForm;
  constructor(private http: HttpClient,
              private ngxNotificationService: NgxNotificationService,
              public dialogRef: MatDialogRef<EditPreferenceDialogComponent>, @Inject(MAT_DIALOG_DATA) data) { 
    this.data = data;
  }

  ngOnInit() {
    this.gender = localStorage.getItem('gender');
    console.log(this.data);
    this.preferenceData = this.data.preferencesDetails;
    console.log(this.preferenceData);
    this.maxHeight = this.getHeight(this.preferenceData.height_max);
    this.minHeight = this.getHeight(this.preferenceData.height_min);

    this.getAllCaste();
  }
  onSubmit() {
    console.log('marital_status', this.preferenceData.marital_status);

    if (this.preferenceForm.valid) {
      const preferenceFormData = new FormData();
      if (this.preferenceData.identity_number && this.preferenceData.identity_number !== '') {
        preferenceFormData.append('identity_number', this.preferenceData.identity_number);
        preferenceFormData.append('temple_id', this.preferenceData.temple_id);
      } else {
        preferenceFormData.append('id', localStorage.getItem('id'));
      }
      preferenceFormData.append('caste', this.preferenceData.caste);
      preferenceFormData.append('manglik', this.preferenceForm.value.manglik);
      preferenceFormData.append('marital_status', this.preferenceForm.value.maritalStatus);
      if (this.gender === 'Male') {
      preferenceFormData.append('working', this.preferenceForm.value.working);
      preferenceFormData.append('occupation', 'na');
    } else {
      preferenceFormData.append('occupation', this.preferenceForm.value.occupation);
      preferenceFormData.append('working', 'na');
    }
      preferenceFormData.append('food_choice', this.preferenceForm.value.food_choice);
      preferenceFormData.append('description', this.preferenceData.description);
      preferenceFormData.append('income_min', this.preferenceData.income_min);
      preferenceFormData.append('income_max', this.preferenceData.income_max);
      preferenceFormData.append('height_min', this.Heights1[this.Heights.indexOf(this.minHeight)]);
      preferenceFormData.append('height_max', this.Heights1[this.Heights.indexOf(this.maxHeight)]);
      preferenceFormData.append('age_min', this.preferenceData.age_min);
      preferenceFormData.append('age_max', this.preferenceData.age_max);
      preferenceFormData.append('mother_tongue', this.preferenceData.mother_tongue);
      preferenceFormData.append('is_lead', localStorage.getItem('is_lead'));

      console.log('marital_status', this.preferenceData.marital_status);


      this.http.post('https://partner.hansmatrimony.com/api/updatePreferencesDetails', preferenceFormData).subscribe(
      (data: any) => {
        console.log(data);
        this.dialogRef.close({success: 'success'});
      },
      (error: any) => {
        console.log(error);
        this.ngxNotificationService.error('Something Went Wrong, Try Again Later');
      }
    );
    } else {
      alert('enter all details');
    }
  }

  getHeight(ht: string) {
    console.log(this.Heights[this.Heights1.indexOf(ht)]);
    return this.Heights[this.Heights1.indexOf(ht)];
  }


    // Caste Selection

    getAllCaste() {
      this.http.get('https://partner.hansmatrimony.com/api/getAllCaste').subscribe((res: any) => {
        this.getcastes = res;
      });
      if (this.preferenceData.Castes && this.preferenceData.Castes !== '') {
      this.casteo = this.preferenceData.Castes.valueChanges.pipe(
        startWith(''),
        map(value => this._Castefilter(value.toString()))
      );
    } else {
      this.preferenceData.Castes = '';
      this.casteo = this.preferenceData.Castes.valueChanges.pipe(
        startWith(''),
        map(value => this._Castefilter(value.toString()))
      );
    }
    }

    private _Castefilter(value: string): string[] {
      if (value != null) {
        const filterValue = value.toLowerCase();
        return this.getcastes.filter(option => option.toLowerCase().includes(filterValue));
      } else {
        const filterValue = 'arora';
        return this.getcastes.filter(option => option.toLowerCase().includes(filterValue));
      }
    }
  
    async casteValidation(value) {
      console.log('caste changed', value );
      const status = 1;
      let statusConfirmed;
      await this.checkCaste(value).then((res: boolean) => {
           statusConfirmed = res;
         });
      console.log('caste changed', statusConfirmed );
  
      if (statusConfirmed === false) {
          this.ngxNotificationService.warning('Please choose a caste from the dropdown');
          this.preferenceData.Castes.setValue('');
          return false;
        }
      return true;
  
      }
  
      checkCaste(value) {
        let status = 1;
        let statusConfirmed = false;
        this.casteo.forEach(element => {
          element.forEach(item => {
            if (value !== '' && item.includes(value) && item.length === value.length ) {
              console.log('confirmed');
              statusConfirmed = true;
            } else {
              status = 0;
            }
          });
        });
        return new Promise((resolve) => {
    resolve(statusConfirmed);
        });
      }
}
