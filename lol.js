var http = require("http");

var options = {
  host: "172.16.116.76",
  port: 3128,
  path: "http://www.google.com",
  headers: {
    Host: "www.google.com"
  }
};
http.get(options, function(res) {
  console.log(res);
  res.pipe(process.stdout);
});