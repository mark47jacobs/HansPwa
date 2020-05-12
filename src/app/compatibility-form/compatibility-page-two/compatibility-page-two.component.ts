import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  Form,
} from '@angular/forms';
import {
  NgxNotificationService
} from 'ngx-kc-notification';
import {
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import {  NotificationsService } from '../../notifications.service';

import {
  MatDialog,
} from '@angular/material/';
import { FourPageService } from '../four-page.service';
import { Profile } from '../profile';
import { element } from 'protractor';
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
  selector: 'app-compatibility-page-two',
  templateUrl: './compatibility-page-two.component.html',
  styleUrls: ['./compatibility-page-two.component.css']
})
export class CompatibilityPageTwoComponent implements OnInit {
    @ViewChild('otpModal', {static: false}) private otpModal: any;

    PageTwo: FormGroup;
    errors: string[] = [];
    authMobileNumberStatus = false;
    workingCity;
    workplace;

    // Educational Qualification

    HigherEducation: hd[] = [{
      group: 'Engineering Design',
      mapping_id: 4,
      names: ['B.E\/B.Tech', 'B.Pharma', 'M.E\/M.Tech', 'M.Pharma', 'M.S. Engineering', 'B.Arch', 'M.Arch', 'B.Des', 'M.Des']
    }, {
      group: 'Computers',
      mapping_id: 4,
      names: ['MCA\/PGDCA', 'BCA', 'B.IT']
    }, {
      group: 'Finance',
      mapping_id: 4,
      names: ['B.Com', 'CA', 'CS', 'ICWA', 'M.Com', 'CFA']
    }, {
      group: 'Managment',
      mapping_id: 4,
      names: ['MBA\/PGDM', 'BBA', 'BHM']
    },
    {
      group: 'Medicine',
      mapping_id: 4,
      names: ['MBBS', 'M.D.', 'BAMS', 'BHMS', 'BDS', 'M.S. (Medicine)', 'MVSc.', 'BvSc.', 'MDS', 'BPT', 'MPT', 'DM', 'MCh']
    },
    {
      group: 'Law',
      mapping_id: 4,
      names: ['BL\/LLB', 'ML\/LLM']
    },
    {
      group: 'Arts\/Science"',
      mapping_id: 4,
      names: ['B.A', 'B.Sc.', 'M.A.', 'M.Sc.', 'B.Ed', 'M.Ed', 'MSW', 'BFA', 'MFA', 'BJMC', 'MJMC']
    },
    {
      group: 'Doctorate',
      mapping_id: 4,
      names: ['Ph.D', 'M.Phil']
    },
    {
      group: 'Non Graduate',
      mapping_id: 4,
      names: ['Diploma', 'High School', '12th', 'Trade School', 'Other']
    }
  ];
  Occupation: string[] = ['Private Job', 'Business/Self-Employed', 'Govt. Job', 'Doctor', 'Teacher', 'Not Working'];

  designations: string[] = [
    'Manager',
    'Sales Manager',
    'Accounts Manager',
    'Product Manager',
    'Software Engineer',
    'Engineer',
    'Hotel Management',
    'Operations Manager',
    'Sales Executive',
    'Operations Executive',
    'Accountant',
    'Marketing Manager',
    'Marketing Executive',
    'Chartered Accountant',
    'Owner',
    'Secretary',
    'Company Secretary',
    'Telesales Executive',
    'Teacher',
    'Clerk',
    'Office Assistant',
    'Relationship Manager',
    'Computer Operator',
    'Chief Executive Officer',
    'Chief Marketing Officer',
    'Chief Finance Officer',
    'Business Development',
    'Project Manager',
    'Program Manager',
    'Solution Architect',
    'Graphic Designer',
    'Content Writer',
    'Director',
    'Business Analyst',
    'Front Office',
    'Back office',
    'Counselor',
    'Event Manager',
    'Legal',
    'Public Relations',
    'Others'];


constructor(private http: HttpClient, public dialog: MatDialog, private _formBuilder: FormBuilder, private router: Router,
            public notification: NotificationsService,
            public fourPageService: FourPageService,
            private ngxNotificationService: NgxNotificationService, private spinner: NgxSpinnerService) {
    this.PageTwo = this._formBuilder.group({
      // tslint:disable-next-line: max-line-length
      Qualification: ['', Validators.compose([Validators.required])],
      Occupation: ['', Validators.compose([Validators.required])],
      Designation: ['', Validators.compose([Validators.required])],
      OtherDesignation: [''],
      Working: ['', Validators.compose([Validators.required])],
      About: [''],
      abroad: ['']
    });
  }

ngOnInit() {
    if (localStorage.getItem('getListId') && localStorage.getItem('getListLeadId')) {
      this.fourPageService.getListData.subscribe(
        () => {
          console.log(this.fourPageService.getProfile());
          this.setFormForGetUserThrough();
        }
      );
  }

    if (localStorage.getItem('getListId') || localStorage.getItem('getListMobile')) {
    this.fourPageService.setLinear(true);
  }
    }

    skip() {
      this.fourPageService.formCompleted.emit(true);
      setTimeout(() => {
        this.Analytics('Four Page Registration', 'Four Page Registration Page Two',
                 'Skipped through Four Page Registration Page Two');
      }, 100);
    }

firstStep() {
    this.errors = [];
    console.log(this.PageTwo.value.Working);
    if (!this.fourPageService.getUserThrough() && this.workingCity == null || this.workingCity === '') {
      this.ngxNotificationService.error('Select A Valid Working City');
      return;
    }

    if (this.PageTwo.valid) {
      this.spinner.show();

      const firststepdata = new FormData();
      firststepdata.append('id', localStorage.getItem('id') ? localStorage.getItem('id') : localStorage.getItem('getListId') );
      firststepdata.append('mobile', localStorage.getItem('mobile_number')
       ? localStorage.getItem('mobile_number') : localStorage.getItem('getListMobile') );
      firststepdata.append('degree', this.PageTwo.value.Qualification);
      firststepdata.append('occupation', this.PageTwo.value.Occupation);
      // if designation equals others set profession equals value of OtherDesignation only if OtherDesignation is not empty.
      firststepdata.append('profession', this.PageTwo.value.Designation !== 'Others' ?
       this.PageTwo.value.Designation :  this.PageTwo.value.OtherDesignation ?
       this.PageTwo.value.OtherDesignation : this.PageTwo.value.Designation );
      firststepdata.append('working_city', this.workplace);
      firststepdata.append('about', this.PageTwo.value.About);
      firststepdata.append('abroad', this.PageTwo.value.abroad);


            // tslint:disable-next-line: max-line-length
      return this.http.post('https://partner.hansmatrimony.com/api/formTwoProfile', firststepdata ).subscribe((res: any) => {
              console.log('first', res);

              if (res.status === 1) {
                this.spinner.hide();
                if (this.fourPageService.getUserThrough()) {
                this.updateFormTwoData(firststepdata);
                }
                this.Analytics('Four Page Registration', 'Four Page Registration Page Two',
                 'Registered through Four Page Registration Page Two');
                // this.ngxNotificationService.success('Registered Successfully');
              } else {
                this.fourPageService.formCompleted.emit(false);
                this.spinner.hide();
                this.ngxNotificationService.error(res.message);
              }
            }, err => {
              this.fourPageService.formCompleted.emit(false);
              this.spinner.hide();
              this.ngxNotificationService.success('SomeThing Went Wrong,Please try again AfterSome time!');
              console.log(err);
            });
          } else {
            // tslint:disable-next-line: forin
            for (const control in this.PageTwo.controls) {
                if (this.PageTwo.controls[control].value === '') {
                  this.errors.push(control);
                }
            }
            this.ngxNotificationService.error('Fill the ' + this.errors[0] + ' detail');
          }
  }

Analytics(type: string, category: string, action: string) {
  if (!localStorage.getItem('getListId') && !localStorage.getItem('getListMobile')) {
    (window as any).ga('send', 'event', category, action, {
      hitCallback: () => {

        console.log('Tracking ' + type + ' successful');

      }
    });

     // gtag app + web
    (window as any).gtag('event', category , {
      'action': action
    });
  }
  }

onAutocompleteSelected(event) {
      this.PageTwo.value.Working = event.formatted_address;
      this.setAbout();
      this.workplace = event.formatted_address;
      console.log('address of family', this.PageTwo.value.Working);
  }
onLocationSelected(e) {
    this.workingCity = e;
    if (this.PageTwo.valid) {
      this.fourPageService.formCompleted.emit(true);
     }
    console.log('location of family', e);
}
changedQualification() {
  console.log('changed Qualification');
  if (this.PageTwo.valid) {
    this.fourPageService.formCompleted.emit(true);
   }
  this.setAbout();
}
changedOccupation() {
  console.log('changed Occupation');
  if (this.PageTwo.valid) {
    this.fourPageService.formCompleted.emit(true);
   }
  this.setAbout();
}
changedDesignation() {
  console.log('changed Designation');
  if (this.PageTwo.valid) {
    this.fourPageService.formCompleted.emit(true);
   }
  this.setAbout();
}
changedAbroad() {
  console.log('changed Abroad');
  if (this.PageTwo.valid) {
    this.fourPageService.formCompleted.emit(true);
   }
}
getQualification(text) {
  const groupIndex = this.HigherEducation.findIndex(
    element => {
      return element.names.includes(text);
    }
  );
  const valueIndex = this.HigherEducation[groupIndex].names.findIndex(
    element => {
      return element.match(text);
    }
  );
  return this.HigherEducation[groupIndex].names[valueIndex];
}
updateFormTwoData(profileData: FormData) {
  this.fourPageService.profile.qualification = profileData.get('degree').toString();
  this.fourPageService.profile.occupation = profileData.get('occupation').toString();
  this.fourPageService.profile.designation = profileData.get('profession').toString();
  this.fourPageService.profile.workingCity = profileData.get('working_city').toString();
  this.fourPageService.profile.about = profileData.get('about').toString();
  this.fourPageService.profile.abroad = profileData.get('abroad').toString();

  console.log(this.fourPageService.getProfile());
}
setAge(dob: string) {
  if (dob != null) {
  return (Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365)));
  } else {
    return null;
  }
}
setAbout() {
  console.log(this.fourPageService.getProfile());
  if (this.fourPageService.getProfile().caste
    && this.fourPageService.getProfile().manglik
    && this.fourPageService.getProfile().gender
    && this.fourPageService.getProfile().locality
    && this.PageTwo.value.Qualification
    && this.PageTwo.value.Occupation
    && this.PageTwo.value.Working) {
    console.log('Setting About');
    this.PageTwo.patchValue({
      // tslint:disable-next-line: max-line-length
      About: `I am ${this.setAge(this.fourPageService.getProfile().dob)} yrs old ${this.fourPageService.getProfile().caste} ${this.fourPageService.getProfile().manglik} ${this.fourPageService.getProfile().gender === 'Male' ?  'boy' : 'girl'} residing in ${this.fourPageService.getProfile().locality}. I've completed my ${this.PageTwo.value.Qualification} and ${this.PageTwo.value.Occupation !== 'Not Working' ? 'working as ' + this.PageTwo.value.Designation : 'Currently not working ' }${this.PageTwo.value.Working !== 'Not Working' ? ' in ' + this.PageTwo.value.Working : '' }.`
    });
  }
}
setFormOneData(userProfile: Profile) {
this.workplace = userProfile.workingCity ? userProfile.workingCity : '';
this.PageTwo.patchValue({
    Qualification: userProfile.qualification ? this.getQualification(userProfile.qualification) : '',
    Occupation: userProfile.occupation,
      Designation: this.designations.includes(userProfile.designation) ? userProfile.designation : 'Others' ,
      OtherDesignation: userProfile.designation,
      Working: userProfile.workingCity,
      About: userProfile.about
  });
}

setFormForGetUserThrough() {
  this.PageTwo = this._formBuilder.group({
    // tslint:disable-next-line: max-line-length
    Qualification: [''],
    Occupation: [''],
    Designation: [''],
    OtherDesignation: [''],
    Working: [''],
    About: [''],
    abroad: ['']
  });
  this.setFormOneData(this.fourPageService.getProfile());
}

}



