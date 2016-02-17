var http = require("http");

var url;
var api_link = "http://api.railwayapi.com/live/train/";
var suffix = "/apikey/taywi1536/";
var code = "BINA";

var doj = "20160214";
var partial_name = "punjab";
var api_link_nametonum = "http://api.railwayapi.com/name_number/train/";

api_link_nametonum = api_link_nametonum.concat(partial_name,suffix);
url = api_link_nametonum;
//console.log(url);

var options = {
  host: "172.16.116.76",
  port: 3128,
  path: url,
  headers: {
    Host: "www.google.com"
  }
};


function get_num(callu) {
    http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            
            console.log("get_num");


            num = response.train.number;
            api_link = api_link.concat(num,"/doj/",doj,suffix);
            console.log(api_link);
            options.path = api_link;
            console.log(options.path);
            //console.log("In get_num:"+num);
            //train_number = num;
             if (response)
                callu();
        });
    });
}

var x = get_num(function callback() {

    get_json(function call(resp) {
      console.log(resp);
    });
});


function findStation (response,station_code) {

    //console.log(response);
    for(var i in response.route ) {
        
        var j = response.route[i]["station"];
            
        if(j == station_code){
            return i;
        }
    }
    //console.log(i);
    return false;
        
}

// ----receive function----v
function get_json(callback) {

    //console.log(options.path);
    //var start_time = new Date().getTime();
    http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
    //var finish_time = new Date().getTime();
    //var time = finish_time-start_time;
    //console.log('Execution time = ' + time);


        //console.log("In main func:"+train_number);
        //console.log(api_link);

        res.on('end', function() {
            var response = JSON.parse(body);
            //console.log(response.route[0]["station_"]["name"]);

            var station_code = code;

            var z = findStation(response,station_code);

            var station = response.route[z];

            if (station)
                callback(station);
            else
                callback("Station not found.\n");
        });
    });
}

         // -----------the url---v         ------------the callback---v
//var mydata = get_json(function (resp) {
 //   console.log(resp);
//});




