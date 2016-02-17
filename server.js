var XMPP = require('stanza.io');
var http = require('http');

var suffix = "/apikey/taywi1536/";
var API_LINKS = {
  livetrain : "http://api.railwayapi.com/live/train/",
  pnr : "http://api.railwayapi.com/pnr_status/pnr/",
  seat_availability : "http://api.railwayapi.com/check_seat/train/",
  tranbtwn : "http://api.railwayapi.com/between/source/",
  nametonum : "http://api.railwayapi.com/name_number/train/"
}
var options = {
  host: "172.16.116.76",
  port: 3128,
  path: "",
  headers: {
          Host: "www.google.com"
        }
};

prev_input = "";

var client = XMPP.createClient({
    // Email - deploymentbotdrawers@gmail.com to get you username and password.
    jid: '3f537dec-4b4c-44b3-8af8-7c9b613b6a7e@ejabberd.sandwitch.in',
    password: '31e90675-e0fd-453d-9bda-05d5bbce9dd2',
    transport: 'websocket',
    wsURL: 'ws://ejabberd.sandwitch.in:5280/websocket'
});

// Bot logged in.
client.on('session:started', function () {
    client.getRoster();
    client.sendPresence();
    console.log("Session started");
});


client.on('chat', function (msg) {
    var input = msg.body;
    var output = generateReply(input); 
    console.log("Message received" + msg.from);
});

client.connect();

function generateReply(input) {

      var output = "";

      if(input == "a" || input == "b" || input == "c" || input == "d") {

          prev_input = input;
          switch(input) {
            case "a":
              output = "Enter train name,station code and date of journey(yyyymmdd), space seperated.";
              break;
            
            case "b":
              output = "Enter PNR number.";
              break;
            
            case "c":
              output = "Enter train number,source station code, destination station code, date(dd-mm-yyyy),class,quota(GN,CK,etc.).";
              break;
            
            case "d":
              output = "Enter source station code, destination station code and date(dd-mm).";
               break;
            
          }

      } else {

        switch(prev_input) {
            case "a":
              var user_input = input.split(/\s+/);
              var api_link = API_LINKS.livetrain;
              var partial_name = user_input[0];
              var code = user_input[1];
              var doj = user_input[2];
              var api_link_nametonum = API_LINKS.nametonum;
              api_link_nametonum = api_link_nametonum.concat(partial_name,suffix);
              var url = api_link_nametonum;
              options.path = api_link_nametonum;
              
                function get_num(callu) {
                    http.get(options, function(res) {
                        var body = '';
                        res.on('data', function(chunk) {
                            body += chunk;
                        });

                        res.on('end', function() {
                            var response = JSON.parse(body);
                            
                            var num = response.train.number;
                            api_link = api_link.concat(num,"/doj/",doj,suffix);
                            options.path = api_link;
                            if (response)
                                callu();
                        });
                    });
                }

                var x = get_num(function callback() {

                    get_json(function call(resp) {
                      output = resp;
                    });
                });


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
                function get_json(callback) {

                    http.get(options, function(res) {
                        var body = '';
                        res.on('data', function(chunk) {
                            body += chunk;
                        });
                        res.on('end', function() {
                            var response = JSON.parse(body);

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


              break;
            
            case "b":
              
              var user_input = input.split(/\s+/);
              var pnr_number = user_input[0];
              options.path   = API_LINKS.pnr + pnr_number + suffix;

              function getPnrStatus(callback) {
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

              var mydata = getPnrStatus(function (resp) {
                  output = resp;
              });

              break;

            case "c":

              var user_input    = input.split(/\s+/);
              var train_number  = user_input[0];
              var src           = user_input[1];
              var dest          = user_input[2];
              var date          = user_input[3];
              var CC            = user_input[4];
              var quota         = user_input[5];
              options.path      = API_LINKS.seat_availability.concat(train_number,"/source/",src,"/dest/",dest,"/date/",date,"/class/",CC,"/quota/",quota,suffix)


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
                              callback("Seat Availability data not found.\n");
                      });
                  });
              }

              var mydata = get_json(api_link, function (resp) {
                  output =resp;
              });

              break;

            case "d":

              var user_input  = input.split(/\s+/);
              var source_code = user_input[0];
              var dest_code   = user_input[1];
              var date        = user_input[2];
              options.path    = API_LINKS.tranbtwn.concat(source_code,"/dest/",dest_code,"/date/",date,suffix);

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
                              callback("Train b/w Stations data not found.\n");
                      });
                  });
              }

              var mydata = get_json(api_link, function (resp) {
                  output = resp;
              });

              break;

         prev_input = "";
      }

      
  
  client.sendMessage({
      to: msg.from,
      type: 'chat',
      requestReceipt: true,
      id: client.nextId(),
      body:  output,
      json: 
      {
         subType: 'TEXT', // subtype can be 'TEXT', 'IMAGE', 'VIDEO', 'CONTACT', 'LOCATION', 'FILE'.
         message: output,
         timestamp: Date.now()
      }
    });
    
}