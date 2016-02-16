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
console.log(url);

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
            
            num = response.train.number;

             if (response)
                callu(num);
            else
                callu(false);
        });
    });
}
var train_number;
get_num(function callu(num){
      train_number = num; 

});
console.log(train_number);

api_link = api_link.concat(train_number,"/doj/",doj,suffix);
options["path"] = api_link;


/*
http.get(options, function(res) {
  console.log(res);
  res.pipe(process.stdout);
});
*/

function findStation (response,station_code) {

    for(var i in response.route ) {
        
        var j = response.route[i]["station"];
            
        if(j == station_code){
            return i;
        }
    }

    return false;
        
}

// ----receive function----v
function get_json(url, callback) {
    http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

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
var mydata = get_json(api_link, function (resp) {
    console.log(resp);
});




