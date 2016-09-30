# httpx-proxy-agent-config
A Node proxy definition for http/https with proxy and blacklist/whitelist configuration


### Installation


```sh
$ npm install bloublou2014/httpx-proxy-agent-config
```

### Quick Start

```js
var proxy = require('httpx-proxy-agent-config');

proxy.install({
 http_proxy: 'http://yourProxy:3128',
 https_proxy: 'http://yourHttpsProxy:3218',
 // example for passportjs Google OAuth2 + Google+
 whitelist: ['www.google.com','accounts.google.com', '173.194.66.95', '74.125.192.95', '209.85.201.95', 'www.googleapis.com']
});

// try to access a page via http request :
var http = require('http');
http.get("http://www.google.com", function (response) {	
	var body = '';
	response.on('data', function (d) {
		body += d;
	});
	response.on('end', function () {
		console.log("Body=", body);
	});
});

// try to access a page via https request
var https = require('https');
https.get("https://www.google.com", function (response) {	
	var body = '';
	response.on('data', function (d) {
		body += d;
	});
	response.on('end', function () {
		console.log("Body=", body);
	});
});

```


## API Reference

- [`.install(Object configuration)`](#install-configuration)
- [`.uninstall()`](#uninstall)
- [`config()`](#config)



### `.install(Object configuration)`

Install proxy on http and https if configuration available.

Configuration options :

- http_proxy : set http proxy like 'http://1.2.3.4:3128'
- https_proxy : set https proxy like 'http://1.2.3.4:3128'
- whitelist : a list of domains or IPs to proxy, otherwise request is done by system.
- blacklist : a list of domains or IPs to not proxy, otherwise request is done via proxy.

Note : whitelist and blacklist can't be used at the same time. Only set one list.

Currently white/blacklist only support string (no regex).


### `.uninstall()`

Restore previous agent and http(s).request functions

### `.config()`

Returns current configuration




