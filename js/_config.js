app.config(($stateProvider, $urlRouterProvider) => {

  $stateProvider.state({
    name: 'common',
    url: '',
    template: '<ui-view></ui-view>',
    abstract:true,
    resolve: {
      curuser: function(authService){
        return authService.isAuthirized()["login"];
      }
    },
    controller: function($state, $scope, $stateParams) {
 	      
 	  }
  });

  $stateProvider.state({
    name: 'common.login',
    url: '/login',
    template: '<login></login>',
    controller: function($state, $scope) {
     
 	  }
  });

  $stateProvider.state({
    name: 'home',
    url: '',
    parent:'common',
    templateUrl: 'mailBox.html',
    abstract:true,
    resolve: {
      emailList: function(emailService){        
        return emailService.getAll().then((data) => { 
          return data.data;    
        });
      },
      usersList: function(userService){        
        return userService.getAll().then((data) => { 
          return data.data;    
        });
      }
    },
    controller: function($state, $scope, $stateParams, authService, curuser) {
 	      if (!authService.isAuthirized()){
          $state.go('common.login');
        }
        $scope.searchWord = ''; 
        $scope.curuser = authService.isAuthirized()["login"];
        $scope.logOut = function(){
          authService.logout();
          $state.go('common.login');
        } 
 	  }
  });
  
  $stateProvider.state({
    name: 'home.box',
    url: '/box/:boxId',
    template: ` 
            <div ng-repeat="email in emails | filterBySearchword:$ctrl.searchWord">
                 <email-line email="email" deleteline="deleteLine(email)"></email-line>
              </div><ui-view></ui-view>
    `,
    resolve: {
    },
    controller: function($state, $scope, $stateParams, emailList, usersList) { 
 	    $scope.boxId = $stateParams.boxId;
        var usrs_dict = {};
        for (var i = 0; i < usersList.length; i++) {
          usrs_dict[usersList[i]['id']] = usersList[i];
        }

      $scope.emails = [];
      for (var i=0; i<emailList.length; i++) {
          if (emailList[i]["box"] == $stateParams.boxId) {
            emailList[i]['userobj'] = usrs_dict[emailList[i]['from']]
            $scope.emails.push(emailList[i]);
          }
      }  
      $scope.deleteLine  = (eml) => {  
           for (var i = 0; i < $scope.emails.length; i++) {
             if ($scope.emails[i]['id'] == eml['id']) {
               $scope.emails.splice(i, 1);
               break;
             }
           }
           for (var i = 0; i < emailList.length; i++) {
             if (emailList[i]['id'] == eml['id']) {
               emailList.splice(i, 1);
               break;
             }
           }
           // also update on server
         };
         
 	}
  });

$stateProvider.state({
    name: 'home.box.mail',
    url: '/:emailId',
    templateUrl: 'email.html',
    controller: function($state, $scope, $stateParams, emailList) {
 	  //$scope.boxId = $stateParams.boxId;
      $scope.emailId = $stateParams.emailId;
      $scope.email = emailList.find(function(elem) { 
        return elem["id"] == $stateParams.emailId;
      });   
 	}
  });

$stateProvider.state({
    name: 'home.newmail',
    url: '/newmail/',
    templateUrl: 'newemail.html',
    controller: function($state, $scope, $stateParams, usersList, emailList) {

        $scope.userTo = undefined;        
        $scope.userss = [];
        for (var i=0; i<usersList.length; i++) {
          if (usersList[i]['deleted']) continue;
          $scope.userss.push({
            StateId: usersList[i]['id'],
            StateCode: usersList[i]['name'],
            StateEmail: usersList[i]['email'],
            StateDesc: usersList[i]['name']+' ('+usersList[i]['email']+')'
          });
        }
      $scope.subject = ''
      $scope.body = ''
      $scope.saveMail = () => {
        var uTo;
        var userobject = null;
        if (!!$scope.userTo.StateId){
            uTo = $scope.userTo.StateId;
            for (var i = 0; i < usersList.length; i++) {
              if ( uTo == usersList[i]['id']) {
                userobject = usersList[i];
              }
            }
        }else{
            uTo = usersList.length+1;
            userobject = {"id": usersList.length+1, "name":$scope.userTo, "email":$scope.userTo};
            usersList.push(userobject);            
        }       
        
        var obj = {"id": emailList.length,
                  "created": new Date(), 
                  "userobj":userobject,
                  "from": uTo, 
                  "to":"me", 
                  "box":2, 
                  "subject":$scope.subject, 
                  "body":$scope.body};

        emailList.push(obj);
        // also update on server
        $state.go('home.box',{boxId:2});
      }
      
 	  }
  });

   $stateProvider.state({
    name: 'home.addressbook',
    url: '/addressbook',
    template: `<button class="compose btn" ui-sref="home.newaddressbook">New</button>
            <div ng-repeat="user in users">
                 <addr-line user="user" deleteaddr="deleteAddr(user.id)" ng-if="user.deleted != true"></addr-line>
              </div><ui-view></ui-view>
    `,
    resolve: {},
    controller: function($state, $scope, $stateParams, usersList, emailList) {
      //$scope.users = usersList;
      $scope.users = [];
      for (var i = 0; i < usersList.length; i++) {
         if (usersList[i]['deleted'] !== true) {
            $scope.users.push(usersList[i]);
         }
      }   
      $scope.deleteAddr  = (id) => {
           var ghost={};
           for (var i = 0; i < usersList.length; i++) {
             if (usersList[i]['id'] == id) {
               ghost.name = usersList[i]['name'];
               ghost.email = usersList[i]['email'];
               usersList[i]['name'] = ghost.name + '<'+ghost.email+'> (not in addressbook)';
               usersList[i]['deleted'] = true;
               //usersList.splice(i, 1);
               break;
             }
           }
           //for (var i = 0; i < emailList.length; i++) {
           // if (emailList[i]["from"] == id) {
           //   emailList[i]['userobj'] = {"name": ghost.name + '<'+ghost.email+'> (not in addressbook)', "email":ghost.email};
           // }
           //}
           
           // also update on server
         };   
 	  }
  });

  $stateProvider.state({
    name: 'home.addressbook.edit',
    url: '/:addressId',
    templateUrl: 'address.html',
    controller: function($state, $scope, $stateParams, usersList) {
      $scope.addressId = $stateParams.addressId;
      $scope.address = usersList.find(function(elem) {
        return elem["id"] == $stateParams.addressId;
      });   
      $scope.saveAddress = (addr) => {
        if (!addr.id ){
          var obj = {"id": usersList.length+1,"name": addr.name, "email":addr.email};
          usersList.push(obj);
        }
        // also update on server
        $state.go('home.addressbook');
      } 
 	  }
  });

  $stateProvider.state({
    name: 'home.newaddressbook',
    url: '/newaddressbook',
    templateUrl: 'address.html',
    controller: function($state, $scope, $stateParams, usersList, emailList) {
      $scope.saveAddress = (addr) => {
          var obj = {"id": usersList.length+1,"name": addr.name, "email":addr.email};
          usersList.push(obj);
        // also update on server
        $state.go('home.addressbook');
      } 
 	  }
  }); 





  $urlRouterProvider.otherwise('/box/1');
});

app.run(function(){
  
});