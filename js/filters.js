app.filter('filterBySearchword', function(){
    return function(items, sw){
      if (!sw) sw = '';
      var result = [];
      angular.forEach(items, function(item){
        if ( (sw == '') ||
        (item.subject.toLowerCase().indexOf(sw.toLowerCase()) != -1) || 
        (item.body.toLowerCase().indexOf(sw.toLowerCase()) != -1) ||
        (item.userobj.name.toLowerCase().indexOf(sw.toLowerCase()) != -1) ){
              result.push(item);
          
        }
      });
      return result;
    };
  });

  app.filter('dateAgo', function() {
      return function dateAgo(date_p) {
        var now_date = new Date();
        var diff = now_date.getTime() - Date.parse(date_p);
        if ( diff <= 120000){ // 2min
            return 'Just now';
        }
        if ( diff <= 60*60000){ // min
           return Math.floor(diff / 60000) + ' minutes ago';
        }
        if ( diff <= 24*60*60000){
            return Math.floor(diff / 3600000) + ' hours ago';
        }
        //days
        return Math.floor(diff / 24 / 3600000) + ' days ago';
      }
   });
app.filter('htmlToPlaintext', function() {
      return function htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
      }
   });
