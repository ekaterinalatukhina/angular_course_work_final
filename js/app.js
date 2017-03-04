'use strict';

  var app = angular.module('myApp', ['ui.router','ui.bootstrap']);


  app.component('boxList', {
    template: `
    <div ng-repeat="box in $ctrl.boxes">  
      <li ui-sref="home.box({ boxId: box.id })" ui-sref-active="active" style="cursor:pointer;">
              {{box.name}}
            </li>
    </div>
    `,
    controller: function(boxService) {
      boxService.getAll().then((data) => {
         this.boxes =  data.data;         
      });
    }
  });

  
  app.component('emailLine', {
    templateUrl: 'emailLine.html',
    controller: function($element) { },
    bindings: {
       email: '<email',
       deleteLine:'&deleteline'
    }
  });

  app.component('newMail', {
    templateUrl: 'newemail.html',
    controller: function() {  },
    bindings: { 
      userslist: '<'
    }
  });

  app.component('addrLine', {
    template: ` 
            <li class="email-item row">
              <div class="people col-sm-1">
                <input type="button" value="Del" ng-click="$ctrl.deleteAddr({id:$ctrl.user.id });">
              </div>
              <div class="people col-sm-2" ui-sref="home.addressbook.edit({addressId:$ctrl.user.id })" style="cursor:pointer;">
                <span class="people-names">
                   <b>{{$ctrl.user.name}}</b>
                </span>
              </div>
              <div class="message col-sm-7" ui-sref="home.addressbook.edit({addressId:$ctrl.user.id })" style="cursor:pointer;">
                <div class="clipper">
                  {{$ctrl.user.email}}                  
                </div>
              </div>
            </li> 
    `,
    controller: function() { },
    bindings: {
       user: '<',
       deleteAddr:'&deleteaddr',
    }
  });


  app.component('login', {
    templateUrl: 'login.html',
    controller: function(authService, $state) {
      if (authService.isAuthirized()){
        $state.go('home.box',{boxId:1});
      }

      this.login= '';
      this.password = '';
      this.logged;
      this.loginMe = () => { 
          this.logged = authService.login(this.login, this.password).then(function(resp){
            if(!!resp){
               $state.go('home.box',{boxId:1});
            }
            return resp;
          });
        };
    },
    bindings: {

    }
  });