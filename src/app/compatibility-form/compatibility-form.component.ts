
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  NgxNotificationService
} from 'ngx-kc-notification';
import {
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import {  NotificationsService } from '../notifications.service';

import {
  MatDialog,
  MatDialogConfig,
} from '@angular/material/';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { element } from 'protractor';
import { FourPageService } from './four-page.service';
export interface StateGroup {
  letter: string;
  names: string[];
}
export interface hd {
  group: string;
  mapping_id: number;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-compatibility-form',
  templateUrl: './compatibility-form.component.html',
  styleUrls: ['./compatibility-form.component.css']
})


export class CompatibilityFormComponent implements OnInit {
  @ViewChild('otpModal', {static: false}) private otpModal: any;

  time = {
    hour: 13,
    minute: 30
  };
  gender;
  MaritalStatus: string[] = ['Never Married', 'Awaiting Divorce', 'Divorcee', 'Widowed', 'Anulled'];
  createProfile: string[] = ['Myself', 'Brother', 'Sister', 'Other'];
  PageOne: FormGroup;

  // birth date
  birthDate: any;
  currentAge: number;
  birthdayValid;
  startDate = new Date(1985, 0, 1);

  // Religion and Caste
  Religions: string[] = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Bahai'];
  casteo: Observable<string[]>;
  getcastes: any = [];
  Caste = false;
  AllCastes = false;

  // Height
    // tslint:disable-next-line: max-line-length
    Heights: string[] = ['4\'0"', '4\'1"', '4\'2"', '4\'3"', '4\'4"', '4\'5"', '4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"', '6\'5"', '6\'6"', '6\'7"', '6\'8"', '6\'9"', '6\'10"', '6\'11"', '7\'0"'];
    // tslint:disable-next-line: max-line-length
    Heights1: string[] = ['48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84'];

  numberCheck: string = localStorage.getItem('RegisterNumber');
  changeNumber = false;
  // tslint:disable-next-line: max-line-length
  date: string[] = ['1', '2' , '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  // tslint:disable-next-line: max-line-length
  month: string[] = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: string[] = [
  '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980',
  '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990',
  '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000',
  '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010',
  '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'
];
  errors: string[] = [];
  authMobileNumberStatus = false;
  locationFamily;
  formTwo = false;
  formThree = false;


  constructor(private http: HttpClient, public dialog: MatDialog, private _formBuilder: FormBuilder, private router: Router,
              public notification: NotificationsService,
              private fourPageService: FourPageService,
              private ngxNotificationService: NgxNotificationService, private spinner: NgxSpinnerService) {
    this.PageOne = this._formBuilder.group({
      // tslint:disable-next-line: max-line-length
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(13)])],
      email: [''],
      Relation: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      birth_date: ['1', Validators.compose([Validators.required])],
      birth_month: ['January', Validators.compose([Validators.required])],
      birth_year: ['1980', Validators.compose([Validators.required])],
      Height: ['', Validators.compose([Validators.required])],
      Weight: ['', Validators.compose([Validators.required])],
      MaritalStatus: ['', Validators.compose([Validators.required])],
      AnnualIncome: ['', Validators.compose([Validators.required, Validators.max(999)])],
      Religion: ['', Validators.compose([Validators.required])],
      Castes: ['', Validators.compose([Validators.required])],
      Mangalik: ['', Validators.compose([Validators.required])],
      locality: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('RegisterNumber')) {
    this.numberCheck = localStorage.getItem('RegisterNumber').substr(3, localStorage.getItem('RegisterNumber').length);
    console.log(localStorage.getItem('RegisterNumber').substr(3, localStorage.getItem('RegisterNumber').length));
    }
    document.querySelector('body').style.background = 'white';
    document.querySelector('body').style.backgroundImage = 'url(\'../../assets/bgicon.png\')';
    document.querySelector('body').style.backgroundSize = 'cover';

    this.fourPageService.formCompleted.subscribe(
      (complete: boolean) => {
        if (complete === true) {
          this.formTwo = true;
         }
      }
    );
    this.fourPageService.form3Completed.subscribe(
      (complete: boolean) => {
        if (complete === true) {
          this.formThree = true;
         }
      }
    );

    this.spinner.hide();
    localStorage.setItem('gender', '');
    localStorage.setItem('mobile_number', '') ;
    localStorage.setItem('selectedCaste', '');
    this.http.get('https://partner.hansmatrimony.com/api/getAllCaste').subscribe((res: any) => {
        this.getcastes = res;
      });
    this.casteo = this.PageOne.get('Castes').valueChanges.pipe(
        startWith(''),
        map(value => this._Castefilter(value))
      );
    }
      // 0 -> new User/not registered, 1-> Registered user , 2-> Partially Registered User
    mobileNumberChanged(number) {
        console.log(number);
        console.log(this.authMobileNumberStatus);
          // tslint:disable-next-line: max-line-length
        this.http.get<any>(' https://partner.hansmatrimony.com/api/auth', {params: { ['phone_number'] : number, ['fcm_id'] : this.notification.getCurrentToken()}}).subscribe(res => {
            console.log(res);
            if (res.registered === 1) {
              localStorage.setItem('mobile_number', number);
              localStorage.setItem('is_lead', res.is_lead);
              this.router.navigateByUrl('chat');
            } else if (res.registered === 2) {
              localStorage.setItem('RegisterNumber', number);
              this.ngxNotificationService.info('Please complete the form and update');
                // set the partiall data
              if (res.partial_data) {
                  const data = res.partial_data;
                  let birthDate: Date;
                  if (data.manglik && data.manglik !== '' && data.manglik === 'No') {
                      data.manglik = 'Non-manglik';
                  }
                  if (data.birth_date && data.birth_date !== '') {
                    birthDate = new Date(data.birth_date);
                    this.PageOne.setValue({
                      phone: number,
                      gender: data.gender,
                      birth_date: birthDate.getDate(),
                      birth_month: birthDate.getMonth(),
                      birth_year: birthDate.getFullYear(),
                      Height: data.height,
                      MaritalStatus: data.marital_status,
                      AnnualIncome: data.annual_income,
                      Religion: data.religion,
                      Castes: data.caste,
                      Mangalik: data.manglik
                    });
                  } else {
                    this.PageOne.setValue({
                      phone: number,
                      gender: data.gender,
                      birth_date: '',
                      birth_month: '',
                      birth_year: '',
                      Height: this.Heights.indexOf(this.Heights[this.Heights1.indexOf(data.height)]),
                      MaritalStatus: data.marital_status,
                      AnnualIncome: data.annual_income,
                      Religion: data.religion,
                      Castes: data.caste,
                      Mangalik: data.manglik
                    });
                  }
                }

            } else {
              localStorage.setItem('RegisterNumber', number);
              console.log('New User');
            }
            this.spinner.hide();
          }, err => {
            this.spinner.hide();
            console.log(err);
          });
    }


  firstStep() {
    console.log(this.PageOne.value.email);
    this.errors = [];
    console.log('date', this.PageOne.value.birth_date);
    console.log('month', this.month.indexOf(this.PageOne.value.birth_month) + 1);
    console.log('year', this.PageOne.value.birth_year);

    if (this.locationFamily == null || this.locationFamily === '') {
      this.ngxNotificationService.error('Select A Valid Location');
      return;
    }

    if (this.PageOne.valid) {
      console.log('caste', this.PageOne.value.Castes);
      this.casteValidation(this.PageOne.value.Castes).then(res => {
          if (res === true) {
            if (this.PageOne.valid) {
              this.spinner.show();
              const date = this.PageOne.value.birth_date;
              const month = this.month.indexOf(this.PageOne.value.birth_month) + 1;
              const year = this.PageOne.value.birth_year;
              console.log(date + '-' + month + '-' + year);
              const firststepdata = new FormData();
              firststepdata.append('mobile', this.PageOne.value.phone);
              firststepdata.append('birth_date', date + '-' + month + '-' + year);
              firststepdata.append('name', this.PageOne.value.firstName + this.PageOne.value.lastName);
              firststepdata.append('email', this.PageOne.value.email);
              firststepdata.append('relation', this.PageOne.value.Relation);
              firststepdata.append('gender', this.PageOne.value.gender);
              firststepdata.append('height', this.Heights1[this.PageOne.value.Height]);
              firststepdata.append('weight', this.PageOne.value.Weight);
              firststepdata.append('marital_status', this.PageOne.value.MaritalStatus);
              firststepdata.append('manglik', this.PageOne.value.Mangalik);
          
              firststepdata.append('annual_income', this.PageOne.value.AnnualIncome);
              firststepdata.append('religion', this.PageOne.value.Religion);
              firststepdata.append('caste', this.PageOne.value.Castes);
              firststepdata.append('locality', this.PageOne.value.locality);

              console.log('mobile', this.PageOne.value.phone);
              console.log('birth_date', this.birthDate);
              console.log('gender', this.PageOne.value.gender);
              console.log('height', this.Heights1[this.PageOne.value.Height]);
              console.log('marital_status', this.PageOne.value.MaritalStatus);
              if (this.PageOne.value.Mangalik === 'Non-manglik') {
              console.log('manglik', 'No');
            } else {
              console.log('manglik', this.PageOne.value.Mangalik);
            }
              console.log('annual_income', this.PageOne.value.AnnualIncome);
              console.log('religion', this.PageOne.value.Religion);
              console.log('caste', this.PageOne.value.Castes);


            // tslint:disable-next-line: max-line-length
              return this.http.post('https://partner.hansmatrimony.com/api/updateBasic', firststepdata ).subscribe((res: any) => {
              console.log('first', res);

              if (res.status === 1) {
                this.spinner.hide();
                localStorage.setItem('id', res.id);
                localStorage.setItem('gender', this.PageOne.value.gender);
                localStorage.setItem('mobile_number', this.PageOne.value.phone);
                this.Analytics('Four Page Registration', 'Four Page Registration Page One',
                'Registered through Four Page Registration Page One');
                // this.router.navigate(['/chat']);
                // this.ngxNotificationService.success('Registered Successfully');
              } else {
                this.spinner.hide();
                this.ngxNotificationService.error(res.message);
              }
            }, err => {
              this.spinner.hide();
              this.ngxNotificationService.success('SomeThing Went Wrong,Please try again AfterSome time!');
              console.log(err);
            });
          } else {
            this.ngxNotificationService.error('Fill the details');
          }
          }
    });
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.PageOne.controls) {
          if (this.PageOne.controls[control].value === '') {
            this.errors.push(control);
          }
      }
      this.ngxNotificationService.error('Fill the ' + this.errors[0] + ' detail');
    }
  }

  private _Castefilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getcastes.filter(option => option.toLowerCase().includes(filterValue));
  }
  Analytics(type: string, category: string, action: string) {
    (window as any).ga('send', 'event', category, action, {
      hitCallback: () => {
        console.log('Tracking ' + type + ' successful');
      }
    });
  }




onDate(event): void {
    console.log(event);
  }

   // Calucalting age
calculateAge(event: any) {
    this.birthDate = convert(event);
    const timediffernce = Math.abs(Date.now() - event);
    this.currentAge = Math.floor((timediffernce / (1000 * 3600 * 24)) / 365);

    localStorage.setItem('currentAge', this.currentAge.toString());

    function convert(str) {
      // tslint:disable-next-line: one-variable-per-declaration
      const date = new Date(str),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join('/');

    }
    this.addSlashes();

    if (this.currentAge < 18) {
      this.birthdayValid = false;
    } else {
      this.birthdayValid = true;
    }

    console.log('birth data', this.birthDate);
    console.log('event data', event);
    console.log(typeof event);

  }

addSlashes() {
    console.log('sv');
    const newInput = document.getElementById('birthDate');
    newInput.addEventListener('keydown', function(e) {
      if (e.which !== 8) {
        const numChars = ( e.target as HTMLInputElement).value.length;
        if (numChars === 2 || numChars === 5) {
          let thisVal = ( e.target as HTMLInputElement).value;
          thisVal += '-';
          ( e.target as HTMLInputElement).value = thisVal;
        }
      }
    });
  }
datePickerClicked() {
    document.querySelector<HTMLElement>('.mat-icon-button').click();
  }

  // Religion
Religion(event) {
    console.log(event.currentTarget.value);
    if (event.currentTarget.value === 'Hindu') {
      // console.log
      this.Caste = true;
      this.AllCastes = true;
    } else if (event.currentTarget.value === 'Muslim') {
      this.Caste = true;
      this.AllCastes = false;
    } else if (event.currentTarget.value === 'Sikh') {
      this.Caste = true;
      this.AllCastes = true;
    } else if (event.currentTarget.value === 'Christian') {
      this.Caste = false;
      this.AllCastes = false;
    } else if (event.currentTarget.value === 'Buddhist') {
      this.Caste = false;
      this.AllCastes = false;
    } else if (event.currentTarget.value === 'Jain') {
      this.Caste = true;
      this.AllCastes = true;
    } else if (event.currentTarget.value === 'Parsi') {
      this.Caste = false;
      this.AllCastes = false;
    } else if (event.currentTarget.value === 'Jewish') {
      this.Caste = false;
      this.AllCastes = false;
    } else if (event.currentTarget.value === 'Bahai') {
      this.Caste = false;
      this.AllCastes = false;
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
      this.PageOne.get('Castes').setValue('');
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

  onAutocompleteSelected(event) {
    this.PageOne.value.locality = event.formatted_address;
    console.log('address of family', this.PageOne.value.locality);

}
onLocationSelected(e) {
    this.locationFamily = e;
    console.log('location of family', e);
}
}


