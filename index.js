/**
 * HTTP/HTTPS configuration Node Proxy
 */
var http = require('http');
var https = require('https');

var util = require('util');
var url = require('url');

var HttpProxyAgent = require('http-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');

var proxyModule = function (proxyConfiguration) {

  var configuration = proxyConfiguration || {
      whitelist: undefined,
      blacklist: undefined,
      http_proxy: undefined,
      https_proxy: undefined
    };

  var _httpAgent;
  var _httpsAgent;
  var _httpRequest;
  var _httpsRequest;
  var httpProxyAgent;
  var httpsProxyAgent;

  function getHttpProxy() {
    return configuration.http_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy ||
      conf['http-proxy'] ||
      conf.proxy ||
      undefined;
  }

  function getHttpsProxy() {
    return configuration.https_proxy ||
      process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      conf['https-proxy'] ||
      conf.proxy ||
      undefined;
  }

  function install() {
    setupHttpProxy();
    setupHttpsProxy();
  }

  function uninstall() {
    if (_httpRequest) {
      http.request = _httpRequest;
      _httpRequest = undefined;
    }
    if (_httpAgent) {
      http.globalAgent = http.Agent.globalAgent = _httpAgent;
      _httpAgent = undefined;
    }
    if (_httpsRequest) {
      https.request = _httpsRequest;
      _httpsRequest = undefined;
    }
    if (_httpsAgent) {
      https.globalAgent = https.Agent.globalAgent = _httpsAgent;
      _httpsAgent = undefined;
    }
  }

  function config(proxyConfiguration) {
    configuration = proxyConfiguration;
  }


  function setupHttpProxy() {
    var httpProxy = getHttpProxy();
    if (httpProxy) {
      httpProxyAgent = new HttpProxyAgent(httpProxy);
      if (httpProxyAgent) {
        _httpAgent = http.globalAgent;
        http.globalAgent = http.Agent.globalAgent = httpProxyAgent;
        _httpRequest = http.request;
        http.request = manageHttpRequest;
      } else {
        throw 'Cannot initialize http proxy';
      }
    }
  }

  function setupHttpsProxy() {
    var httpsProxy = getHttpsProxy();
    if (httpsProxy) {
      httpsProxyAgent = new HttpsProxyAgent(httpsProxy);
      if (httpsProxyAgent) {
        _httpsAgent = http.globalAgent;
        https.globalAgent = https.Agent.globalAgent = httpsProxyAgent;
        _httpsRequest = https.request;
        https.request = manageHttpsRequest;
      } else {
        throw 'Cannot initialize https proxy';
      }
    }
  }

  function checkList(options) {
    var host = options.host || options.hostname;

    if (host && configuration.whitelist) {
      return (configuration.whitelist.indexOf(host) > -1);
    }

    if (host && configuration.blacklist) {
      return (configuration.blacklist.indexOf(host) < 0);
    }

    // by default proxy if no list
    return true;
  }

  function formatOptions(options) {
    if (typeof options === 'string') {
      return url.parse(options);
    }
    return util._extend({}, options);
  }

  function manageHttpRequest(options, cb) {
    options = formatOptions(options);

    if (!options.agent && checkList(options)) {
      options.agent = httpProxyAgent;
    }

    return _httpRequest.call(http, options, cb);
  }

  function manageHttpsRequest(options, cb) {
    options = formatOptions(options);

    if (!options.agent && checkList(options)) {
      options.agent = httpsProxyAgent;
    }

    return _httpsRequest.call(https, options, cb);
  }

  return {
    install : install,
    uninstall: uninstall,
    config: config
  }

};

module.exports = proxyModule;
