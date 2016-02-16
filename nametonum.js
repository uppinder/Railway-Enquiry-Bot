var http = require("http");

var api_link = "http://api.railwayapi.com/name_number/train/";
var suffix = "/apikey/gnhqs6492/";
var partial_name = "BHOPAL";


api_link = api_link.concat(partial_name,suffix);
//console.log(api_link)

var options = {
  host: "172.16.116.76",
  port: 3128,
  path: api_link,
  headers: {
    Host: "www.google.com"
  }
};

// ----receive function----v
function get_json(url, callback) {
    http.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            var response = JSON.parse(body);
            
             if (response)
                callback(response);
            else
                callback("PNR not found.\n");
        });
    });
}

var mydata = get_json(api_link, function (resp) {
    console.log(resp);
});
