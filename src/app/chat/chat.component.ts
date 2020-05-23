import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Router,
  ActivatedRoute,
  Event
} from '@angular/router';
import {
  Observable,
} from 'rxjs';
import {
  NgxSpinnerService
} from 'ngx-spinner';
import {
  NgxNotificationService
} from 'ngx-kc-notification';
import {
  InstallPromptService
} from '../install-prompt.service';
import {
  MatDialog,
} from '@angular/material';

import {
  NotificationsService
} from '../notifications.service';
import {
  timeout,
  retry,
  catchError,
  min
} from 'rxjs/operators';
import {
  FindOpenHistoryProfileService
} from '../find-open-history-profile.service';
import {
  ChatServiceService
} from '../chat-service.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewInit {


  familyTable = {
    id: '',
    temple_id: '',
    identity_number: '',
    name: '',
    relation: '',
    locality: '',
    landline: '',
    family_photo: '',
    city: '',
    native: '',
    mobile: '',
    email: '',
    unmarried_sons: '',
    married_sons: '',
    unmarried_daughters: '',
    married_daughters: '',
    family_type: '',
    house_type: '',
    religion: '',
    caste: '',
    gotra: '',
    occupation: '',
    family_income: '',
    budget: '',
    office_address: '',
    father_status: '',
    mother_status: '',
    created_at: '',
    updated_at: '',
    whats_app_no: '',
    marriage_budget_not_applicable: '',
    email_not_available: '',
    mother_tongue: '',
    sub_caste: '',
    country: '',
    state: '',
    occupation_mother: '',
    address: '',
    about: '',
    caste_id: '',
    zodiac: '',
    father_off_addr: ''
  };

  preferenceTable = {
    id: '',
    identity_number: '',
    temple_id: '',
    age_min: '',
    age_max: '',
    height_min: '',
    height_max: '',
    caste: '',
    marital_status: '',
    manglik: '',
    food_choice: '',
    working: '',
    occupation: '',
    sub_occupation: '',
    income_min: '',
    income_max: '',
    citizenship: '',
    description: '',
    membership: '',
    caste_no_bar: '',
    created_at: '',
    updated_at: '',
    source: '',
    amount_collected: '',
    insentive: '',
    validity: '',
    payment_method: '',
    receipt_url: '',
    status: '',
    mother_tongue: '',
    temple_name: ''
  };

  loginStatus = true;
  profile: any;
  messageRecieved: string;
  personal: any;
  button;
  Data: any;
  errorCount = 0;
  Data1: any;
  walkthroughNumber = 0;
  clientWalkThroughStatus;
  showWalkthrough;
  user: any;
  innerWidth: any;
  currentIndex;
  innerHeight: any;
  DoNotshowfull: boolean;
  number: string;
  text: string;
  currentUrl: string;
  awardUrl: string;
  botui: any;
  langChanged = false;
  currentLanguage: string;
  historyData: any;
  currentContact: any;
  profileData: any;
  familyData: any;
  preferenceData: any;
  history = 'chatbot';
  points: any;
  promptData: any = null;
  pId: string[] = [];
  pName: string[] = [];
  connectionStatus;
  player;
  done = false;
  dailyQuotaReached = false;
  noCount = 0;
  shortCount = 0;
  exhaustCount = 0;
  paidStatus;
  exhaustedStatus;
  selectedTab;
  tabType;
  currentTab;
  profilesCompletedStatus = false;
  timerMain;
  photo;
  lockdownCount = 0;


  constructor(
    private router: Router,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private ngxNotificationService: NgxNotificationService,
    private promptService: InstallPromptService,
    public dialog: MatDialog,
    public notification: NotificationsService,
    private route: ActivatedRoute,
    public itemService: FindOpenHistoryProfileService,
    private chatServivce: ChatServiceService
  ) {
  }

  ngOnInit() {
    if (this.router.url.match('logout')) {
      this.loginStatus = false;
      localStorage.setItem('mobile_number', '');
      localStorage.setItem('id', '');
      localStorage.setItem('gender', '');
    }
    window.addEventListener('offline',
      () => {
        console.log('No Internet');
        this.connectionStatus = 'offline';
        this.showError();
      });

    window.addEventListener('online',
      () => {
        console.log('Connected Internet');
        this.connectionStatus = 'online';
      }
    );

    if (this.router.url.match('push')) {
      this.Analytics('Push Web', 'Push Web', 'Notification Clicked');
    }


    if (localStorage.getItem('mobile_number')) {
      this.loginStatus = true;
    } else {
      this.loginStatus = false;
    }
    if (localStorage.getItem('language')) {
      this.currentLanguage = localStorage.getItem('language');
    } else {
      this.currentLanguage = 'Hindi';
      localStorage.setItem('language', 'Hindi');
    }

    if (this.router.url.match('mobile=')) {
      this.currentUrl = this.router.url.substring(13);
      localStorage.setItem('mobile_number', this.currentUrl);
      console.log(this.currentUrl);
    }

    if (localStorage.getItem('mobile_number')) {
      this.chatServivce.setContactNumber(localStorage.getItem('mobile_number'));
      this.currentContact = localStorage.getItem('mobile_number');

    } else if (this.currentUrl) {
      this.chatServivce.setContactNumber(this.currentUrl);
      this.Analytics('login', 'login', 'logged In');
      this.currentContact = this.currentUrl;
    } else {
      this.router.navigateByUrl('phone-number');
    }

    // add to home screen prompt
    console.log(this.promptService.getPrompt());
    this.promptData = this.promptService.getPrompt();
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.route.paramMap.subscribe(
      (data: any) => {
        console.log(data.params.fcm_app);
        if (data) {
          if (data.params.fcm_app) {
            localStorage.setItem('fcm_app', data.params.fcm_app);
            this.Analytics('Android App', 'Android App', 'Logged In through App');
          }
          if (data.params.stage) {
            setTimeout(() => {
              this.setSelectedTab(data.params.stage);
            }, 500);
          }
        }
      }
    );

    this.itemService.setTab.subscribe(
      data => {
        this.setSelectedTab(data);
      }
    );
  }

  ngAfterViewInit() {
    this.spinner.hide();

    // as soon as the credits are updated we will show lockdown offer to the free user
    // lockdown offer will not be shown to first time coming user
    this.itemService.creditsUpdated.subscribe(
      data => {
        if (data) {
          this.lockdownCount++;
          if (!this.router.url.match('first') && this.lockdownCount === 1) {
            this.itemService.openLockdownAd();
          }
        }
      }
    );
  }

  getCredits() {
    const creditsData = new FormData();
    creditsData.append('id', localStorage.getItem('id'));
    if (localStorage.getItem('is_lead')) {
      creditsData.append('is_lead', localStorage.getItem('is_lead'));
    } else {
      this.checkUrl(localStorage.getItem('mobile_number')).subscribe(res => {
          console.log(res);
          creditsData.append('is_lead', res.is_lead);
          localStorage.setItem('is_lead', res.is_lead);
        },
        err => {
          console.log(err);
        });
    }
    // tslint:disable-next-line: max-line-length
    return this.http.post < any > ('https://partner.hansmatrimony.com/api/getWhatsappPoint', creditsData).subscribe(
      (data: any) => {
        this.points = data.whatsapp_points;
        this.itemService.setCredits(this.points);
        console.log('credits', this.points);
        if (this.paidStatus === 'Paid' && this.points === '0') {
          console.log('this is a exhausted profile');
          this.exhaustedStatus = true;
        }
      },
      (error: any) => {
        this.ngxNotificationService.error('We couldn\'t get your credits, trying again');
        console.log(error);
        this.spinner.hide();
      }
    );
  }


  checkUrl(num: string): Observable < any > {
    localStorage.setItem('is_lead', '');
    if (localStorage.getItem('fcm_app')) {
      // tslint:disable-next-line: max-line-length
      return this.http.get < any > (' https://partner.hansmatrimony.com/api/auth', {
        params: {
          ['phone_number']: num,
          ['fcm_app']: localStorage.getItem('fcm_app')
        }
      });
    } else {
      // tslint:disable-next-line: max-line-length
      return this.http.get < any > (' https://partner.hansmatrimony.com/api/auth', {
        params: {
          ['phone_number']: num,
        }
      });
    }
  }

  setProfileImage(image) {
    if (image) {
    this.photo = image;
    } else {
      this.photo = '../../assets/avatar.svg';
    }
  }

  setTabNames(tab: any) {
    if (localStorage.getItem('language') === null) {
      localStorage.setItem('language', 'Hindi');
    }
    switch (localStorage.getItem('language')) {
      case 'English':
        switch (tab) {
          case 0:
            return 'Today\'s Matches';
          case 1:
            return 'Contacted';
          case 2:
            return 'Liked By You';
          case 3:
            return 'Liked You';
          case 4:
            return 'Rejected';
          default:
            break;
        }
        break;
      case 'Hindi':
        switch (tab) {
          case 0:
            return 'आज के रिश्ते';
          case 1:
            return 'कोन्टक्टेड';
          case 2:
            return 'मेरी पसंद';
          case 3:
            return 'मै किसे पसंद हूँ';
          case 4:
            return 'नापसंद ';
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  showError() {
    this.history = 'connection_error';
    document.getElementById('footerVisibility').style.display = 'none';
  }
  
  changeToHistory() {
    if (this.currentContact) {
      (window as any).ga('send', 'event', 'history', 'history clicked', {
        hitCallback: () => {
          console.log('Tracking history successful');
        }
      });
      this.history = 'history';

      console.log(localStorage.getItem('id'));
      this.scrollHorizontal(this.currentTab);
    }
  }
  changeToPersonalized() {
    if (this.currentContact) {
      (window as any).ga('send', 'event', 'personalized section', 'personalized clicked', {
        hitCallback: () => {
          console.log('Tracking personalized successful');
        }
      });
      this.history = 'personalized';
      this.scrollHorizontal(this.currentTab);
    }
  }
  changeToBot() {
    this.history = 'chatbot';
  }
  changeToMyProfile() {
    if (this.currentContact) {
      this.spinner.show();
      this.history = 'myprofile';
      console.log(localStorage.getItem('id'));
      const myprofileData = new FormData();
      myprofileData.append('id', localStorage.getItem('id'));
      myprofileData.append('contacted', '1');
      if (localStorage.getItem('is_lead')) {
        myprofileData.append('is_lead', localStorage.getItem('is_lead'));
      } else {
        this.checkUrl(localStorage.getItem('mobile_number')).subscribe(res => {
            console.log(res);
            myprofileData.append('is_lead', res.is_lead);
            localStorage.setItem('is_lead', res.is_lead);
          },
          err => {
            console.log(err);
          });
      }
      // tslint:disable-next-line: max-line-length
      return this.http.post < any > ('https://partner.hansmatrimony.com/api/getProfile', myprofileData).pipe(timeout(7000), retry(2), catchError(e => {
        throw new Error('Server Timeout ' + e);
      })).subscribe(
        (data: any) => {
          console.log(data);
          if (data.family) {
            this.familyData = data.family;
          } else {
            this.familyData = this.familyTable;
          }
          if (data.preferences) {
            this.preferenceData = data.preferences;
          } else {
            this.preferenceData = this.preferenceTable;
          }
          if (data.profile) {
            this.profileData = data.profile;
            if (data.profile.gender) {
              localStorage.setItem('gender', data.profile.gender);
              console.log(data.profile.gender);
            }
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
          console.log(error);
          this.ngxNotificationService.error('Something Went Wrong');
          this.logout();
          this.showError();
        }
      );
    } else {
      this.ngxNotificationService.error('No user found');
      this.logout();
    }
  }

 
  logout() {
    this.loginStatus = false;
    localStorage.clear();
    this.router.navigateByUrl('/home');
  }

  Analytics(type: string, category: string, action: string) {
    (window as any).gtag('send', 'event', category, action, {
      hitCallback: () => {

        console.log('Tracking ' + type + ' successful');

      }

    });

     // gtag app + web
    (window as any).gtag('event', category , {
      'action': action
    });
  }

  changeSelectedTab(event: any) {
    console.log(event);
    this.currentTab = event;

    if (this.itemService.getIsLead() === 0) {
    switch (event) {
      case 0:
        this.changeToBot();
        break;
      case 1:
        this.tabType = 'contacted';
        this.changeToHistory();
        break;
      case 2:
        this.tabType = 'interestShown';
        this.changeToHistory();
        break;
      case 3:
        this.tabType = 'interestReceived';
        this.changeToHistory();
        break;
      case 4:
        this.tabType = 'personalized';
        this.changeToPersonalized();
        break;
      case 5:
        this.tabType = 'rejected';
        this.changeToHistory();
        break;

      default:
        break;
    }
  } else {
    switch (event) {
      case 0:
        this.changeToBot();
        break;
      case 1:
        this.tabType = 'contacted';
        this.changeToHistory();
        break;
      case 2:
        this.tabType = 'interestShown';
        this.changeToHistory();
        break;
      case 3:
        this.tabType = 'interestReceived';
        this.changeToHistory();
        break;
      case 4:
        this.tabType = 'rejected';
        this.changeToHistory();
        break;

      default:
        break;
    }
  }

  }
  setSelectedTab(index: any) {
    console.log('selected tab', index);
    if (index !== '') {
      this.selectedTab = index;
      this.changeSelectedTab(this.selectedTab);
    } else {
      this.selectedTab = 0;
      this.changeToBot();
    }

    console.log('selectedTabValue', this.selectedTab);
  }
  goToSubs() {
    this.router.navigateByUrl('subscription');
  }
  scrollHorizontal(index: any) {
    document.querySelectorAll('.mat-tab-label')[index].scrollIntoView();
  }
  chatTimer() {
    this.profilesCompletedStatus = true;
    let timerMaxSeconds = Math.floor(7 * 1000);
    let timerCurrentSecond;
    this.botui.message.add({
      loading: true,
      delay: 500,
      type: 'html',
      content: '<div id="3no">' +

        '<div style="text-align:center">' +
        '<h5>Moving To मेरी पसंद in</h5>' +
        '</div>' +
        // tslint:disable-next-line: max-line-length
        '<div style="text-align: center;"><p style="display: inline-block;border: 2px solid red;border-radius:10px;padding-left:20px;padding-right:20px;font-size:18px" id="timer"></p></div>' +
        '</div>'
    }).then(() => {
      this.startTimer(timerMaxSeconds, timerCurrentSecond);
    });
  }

  startTimer(timerMaxSeconds: any, timerCurrentSecond: any) {
    this.timerMain = setInterval(() => {
      timerMaxSeconds = timerMaxSeconds - 1000;
      timerCurrentSecond = Math.floor(timerMaxSeconds / 1000);
      document.getElementById('timer').innerText = timerCurrentSecond.toString() + 's';

      if (Math.floor(timerCurrentSecond) === 0) {
        this.setSelectedTab(2);
        clearInterval(this.timerMain);
      }
    }, 1000);
  }


}
