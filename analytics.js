var request = require('request');
var https = require('https');
var httpSignatureLib = require('http-signature');
var regression = require('regression');
var moment = require('moment');
var sshpk = require('sshpk');
var fs = require('fs');

var options = {};
var httpSignature= {
  id: "b2f20640-22f0-11e6-8e34-794e588bdc2e",
  key: "MIIEowIBAAKCAQEAiPvJJcsLfWr79RFGO7sct2oI506EAET/c85hQQU4Nvco0G2EorytHjlgCSX/k25ZzuVuLAXHrK+Dx1TtglotTq3KVpnAtfxxx82XEO4KcWeN+Xn51snWwYM/shEW++y820l630cuvZfMFbvrbcEt3HC9g+ayzpPWXVex7m4E/zJ4p+AFjN8vigrmKh/I63rhv4nfNUuSirU5QpcXWvKpZWfSD5EXYyyJV1WQuspCJyYODUI5v15V8OuTpgWlY8ngqfjFKkxoIMUbj+Njo0uRNt076U3VH7DqfRlHEBEX2al4YvhqBtCdB72hBeFpZfDEO8XRadVjr6rsRr4E0/HYyQIDAQABAoIBAFQaKoRepl5JSgpLodBYcCgYHQFOznKP6jsCselGuB3fH5rgMrfrmWpeFZ1oTAMLlG4XpM24esCGPiUq+mu2y+xrfTgwTAYvyPfAPQiy7Yx05NEP15nM8GJ9H6VHItJnpggIlDzzqjnTMgUCDGilW2/ldCXAhXWZhNpoViEqQT0gq6NOFgndkRDnCb91HMgoHBCKFozPvgfDO85yU/gc3qzuuAC9aurWi6ElbucLHUlAbNub0LRseIjFNR7/HauGu/aMf/ba8J6acsDdwzyr9S5MtcYuaKtGsuz7IByPVz2zKjY0MObIqRd11lYc8AuabCgf5uylZsHKBuFNKVO7qAUCgYEAzv10joZZm0GV9FRNHK5vJPrj6nlj0T30/NSQMt2gvyEHJIrgOK5y9nsCpLyPDq6p2CAViZhVItdli6zbBZjaP2dYLU3q8CxPov+KhIyGDojv/NOnqx/vU/25kYyp8N8M1sSujLDqrffMM0MtzRI9YRsewsxK5oMskaowLbcyRZcCgYEAqWrwQBma160Jra96bRdEZg1cr+hBSvOOXVz0vP1S/d7gl6Kse21Mee3BmAOWlKpMKW5BSymA3lIKoozvk+kDsysYuROBHJUZqSAUvkT5LF3jwN6wufed0VaSdEUWcPwpYpdLNnV238+iJJ0MOUtU0ciasd/+P54Hvl7QYs9gYJ8CgYEAowJ/9G5hyx9PlOd/AwNsjFb5fwKyVWrRsPtFxIk9user9F9aTck0yF//qPTGRO3Q3GAIFiBdi97OHb23jyTdW+lrS+J9D0AWR2uwDssMGA5H0XhuJxozRJYgujto6kT+u3SRckMxzmfD7OsO+t1OcVcGVqrEodzUELNS1e3cLWkCgYArL6lijaRdCi0Ha03n9SBoa0uPQ8MxGfjWb9WrP2AieugBf2Q8alYuVp8c4v1FlEup3AMk58WD5qHzYb3IlINu7rN0qjYlVRSfeiAPiIGD/8MI7TtbjHVcYZcfsGTSFFVwXmS70yGkV8dbUfVFvaA3gc19Pj4PdXc/3ed86KQGvQKBgGSI3iXWElbiBZeXWi5JQDrmcn3v9EEMaxkwBubbx797ZdGUnZBL6ZGZMBgdMktzuPdiH7eoltJL1ZAzjFZ8MTHi6HG3PhdGZ96lT1w0QF5dhPnfVCTXGwRdguPEAgmurxzrNJrNANl/JyF8gfGnOqg0/pC2KkT6QPFCe3EpAJ6E",
  private_key: "\
  MIIEowIBAAKCAQEAiPvJJcsLfWr79RFGO7sct2oI506EAET/c85hQQU4Nvco0G2EorytHjlg\n\
  CSX/k25ZzuVuLAXHrK+Dx1TtglotTq3KVpnAtfxxx82XEO4KcWeN+Xn51snWwYM/shEW++y8\n\
  20l630cuvZfMFbvrbcEt3HC9g+ayzpPWXVex7m4E/zJ4p+AFjN8vigrmKh/I63rhv4nfNUuS\n\
  irU5QpcXWvKpZWfSD5EXYyyJV1WQuspCJyYODUI5v15V8OuTpgWlY8ngqfjFKkxoIMUbj+Nj\n\
  o0uRNt076U3VH7DqfRlHEBEX2al4YvhqBtCdB72hBeFpZfDEO8XRadVjr6rsRr4E0/HYyQID\n\
  AQABAoIBAFQaKoRepl5JSgpLodBYcCgYHQFOznKP6jsCselGuB3fH5rgMrfrmWpeFZ1oTAML\n\
  lG4XpM24esCGPiUq+mu2y+xrfTgwTAYvyPfAPQiy7Yx05NEP15nM8GJ9H6VHItJnpggIlDzz\n\
  qjnTMgUCDGilW2/ldCXAhXWZhNpoViEqQT0gq6NOFgndkRDnCb91HMgoHBCKFozPvgfDO85y\n\
  U/gc3qzuuAC9aurWi6ElbucLHUlAbNub0LRseIjFNR7/HauGu/aMf/ba8J6acsDdwzyr9S5M\n\
  tcYuaKtGsuz7IByPVz2zKjY0MObIqRd11lYc8AuabCgf5uylZsHKBuFNKVO7qAUCgYEAzv10\n\
  joZZm0GV9FRNHK5vJPrj6nlj0T30/NSQMt2gvyEHJIrgOK5y9nsCpLyPDq6p2CAViZhVItdl\n\
  i6zbBZjaP2dYLU3q8CxPov+KhIyGDojv/NOnqx/vU/25kYyp8N8M1sSujLDqrffMM0MtzRI9\n\
  YRsewsxK5oMskaowLbcyRZcCgYEAqWrwQBma160Jra96bRdEZg1cr+hBSvOOXVz0vP1S/d7g\n\
  l6Kse21Mee3BmAOWlKpMKW5BSymA3lIKoozvk+kDsysYuROBHJUZqSAUvkT5LF3jwN6wufed\n\
  0VaSdEUWcPwpYpdLNnV238+iJJ0MOUtU0ciasd/+P54Hvl7QYs9gYJ8CgYEAowJ/9G5hyx9P\n\
  lOd/AwNsjFb5fwKyVWrRsPtFxIk9user9F9aTck0yF//qPTGRO3Q3GAIFiBdi97OHb23jyTd\n\
  W+lrS+J9D0AWR2uwDssMGA5H0XhuJxozRJYgujto6kT+u3SRckMxzmfD7OsO+t1OcVcGVqrE\n\
  odzUELNS1e3cLWkCgYArL6lijaRdCi0Ha03n9SBoa0uPQ8MxGfjWb9WrP2AieugBf2Q8alYu\n\
  Vp8c4v1FlEup3AMk58WD5qHzYb3IlINu7rN0qjYlVRSfeiAPiIGD/8MI7TtbjHVcYZcfsGTS\n\
  FFVwXmS70yGkV8dbUfVFvaA3gc19Pj4PdXc/3ed86KQGvQKBgGSI3iXWElbiBZeXWi5JQDrm\n\
  cn3v9EEMaxkwBubbx797ZdGUnZBL6ZGZMBgdMktzuPdiH7eoltJL1ZAzjFZ8MTHi6HG3PhdG\n\
  Z96lT1w0QF5dhPnfVCTXGwRdguPEAgmurxzrNJrNANl/JyF8gfGnOqg0/pC2KkT6QPFCe3Ep\n\
  AJ6E"
}
var keyPri = fs.readFileSync('private_key.pub', 'ascii');
//var key = sshpk.parseKey(keyPri, 'ssh');
var analytics = (function(){
  return{
    calculateLinechart: function(coin_slug,buy,res,callback){
      var raw;
      var result;
      var responseAssign = function(da){
        var raw = da;
        var toReturn = [];
        raw.sort(function(a, b){
          var keyA = new moment(a.created_at),
          keyB = new moment(b.created_at);
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
        var baseDate = Date.parse(raw[raw.length-1].created_at);
        raw.forEach(function(order){
          var entry = [];
          entry.push(Date.parse(order.created_at));
          entry.push(order.per_price);
          toReturn.push(entry);
        })
        var result = regression.linear(toReturn, {
          order: 2,
          precision: 5,
        });
        var g = result.equation[0];
        var y = result.equation[1];
        for(i=0; i<11; i++){
          baseDate += 3000;
          toReturn.push([baseDate, g*baseDate+y]);
        }
        return toReturn;
      }
     
      if (buy == 1) {
        options.url = 'http://project.fundplaces.com:9091/v1/orders/coin/'+coin_slug+"/buy";
        request(options, function (error, response, body) {
          console.log('error:', error); 
          console.log('statusCode:', response && response.statusCode);
          if(error){
            callback(res, {
              message: 'error connecting to fundplaces server',
              error: error
            });
          }else{
            if (JSON.parse(response.body).resources.length !== 0) {
              callback(res, responseAssign(JSON.parse(response.body).resources));
            }else{
              callback(res, "No data for the input parameters");
            }
          }
        });
      }else{
        options.url = 'http://project.fundplaces.com:9091/v1/orders/coin/'+coin_slug+"/sell";
        request(options, function (error, response, body) {
          console.log('error:', error); 
          console.log('statusCode:', response && response.statusCode); 
          if(error){
            callback(res, {
              message: 'error connecting to fundplaces server',
              error: error
            });
          }else{
            if (JSON.parse(response.body).resources.length !== 0) {
              callback(res, responseAssign(JSON.parse(response.body).resources));
            }else{
              callback(res, "No data for the input parameters");
            }
          }
        });
      }
    }
  }

})();


module.exports = analytics;
