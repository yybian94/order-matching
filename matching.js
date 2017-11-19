var dao = require('./dao');
var request = require('request');

var matching = (function(){
  var sellOrders = [];
  var buyOrders = [];
  var buyOrderBooks = {};
  var sellOrderBooks = {};
  var matchResults = [];
  var result = {};
  var matchResults2 = [];
  var matchEntry = {
   involved: []
 };
 var matchEntry2 = {
   matches: []
 };
 var unmatchedOrder = [];
 var requestServer = function(results){
  console.log(results);
  if(results.length > 0){
    results.forEach(function(result){
      result.matches.forEach(function(match){
        var body = {
          json: {
            buy_order_id : match.buy,
            sell_order_id : match.sell,
            coin_amt : match.coin_amt,
            token_amt : result.per_price*match.coin_amt
          }
        }
        console.log(body);
        request.post('http://project.fundplaces.com:9091/v1/orders/match', body, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            if(body){
              var buyerId = body[0].account_id;
              var sellerId = body[1].account_id;
              var body = {
                json: {
                  event: "event",
                  data: {
                  }
                }
              }
              request.post(
                'http://project.fundplaces.com:9091/v1/account/'+ buyerId +'/ping', body,function (error, response, body) {
                  console.log("Reach ping");
                  console.log(error);
                  if (!error && response.statusCode == 200) {

                  }
                }
                );
              request.post(
                'http://project.fundplaces.com:9091/v1/account/'+ sellerId +'/ping', body,function (error, response, body) {
                  if (!error && response.statusCode == 200) {

                  }
                }
                );
            }

          }
        }
        );
      });    
    })
  }else{
    //Notify
  }
}
var match_lite_2 = function(bOrders, sOrders, per_price){
 var buycoin_amt = 0;
 var sellcoin_amt = 0;
 bOrders.forEach(function(bOrder){
  buycoin_amt = buycoin_amt+bOrder.coin_amt;
});
 sOrders.forEach(function(sOrder){
  sellcoin_amt = sellcoin_amt+sOrder.coin_amt;
});
 if (buycoin_amt > sellcoin_amt) {
  sOrders.forEach(function(sOrder){
   var tempMatch = [];
   var match = {
    sell : sOrder.id
  }
  var tempSellcoin_amt = sOrder.coin_amt;
      /*var match = function(){
        return {
          sell : sOrder.id
        }
      };*/
      //insert sort
      bOrders.forEach(function(buyOrder){
        var temp = {
          sell : sOrder.id
        };
        temp.buy = buyOrder.id;
        temp.coin_amt = Math.floor((buyOrder.coin_amt * sOrder.coin_amt)/buycoin_amt);
        tempSellcoin_amt = tempSellcoin_amt - temp.coin_amt;
        /*if (Math.floor((buyOrder.coin_amt * sOrder.coin_amt)/buycoin_amt) != 0) {
          temp.coin_amt = Math.floor((buyOrder.coin_amt * sOrder.coin_amt)/buycoin_amt);
          tempSellcoin_amt = tempSellcoin_amt - temp.coin_amt;
        }else{
          if(tempSellcoin_amt > buyOrder.coin_amt){
            temp.coin_amt = buyOrder.coin_amt;
            tempSellcoin_amt = tempSellcoin_amt - temp.coin_amt;
            temp.full = true;
          }else{
            temp.coin_amt = tempSellcoin_amt;
            tempSellcoin_amt = tempSellcoin_amt - temp.coin_amt;
          }
          
        }*/
        tempMatch.push(temp);

      });   
      var i = 0;
      while(tempSellcoin_amt != 0){
        tempMatch[i].coin_amt ++; 
        tempSellcoin_amt --;
        if(i < tempMatch.length){
          i++;
        }else{
          i = 0;
        }
      }
      i = 0;  
      matchEntry2.matches = matchEntry2.matches.concat(tempMatch);

    })
  matchResults2.push(matchEntry2);
  matchEntry2 = {
   matches: []
 }
}else{
  bOrders.forEach(function(bOrder){
   var tempMatch = [];
   var match = {
    buy : bOrder.id
  }
  tempBuycoin_amt = bOrder.coin_amt;
      //insert sort
      sOrders.forEach(function(sellOrder){
        var temp = {
          buy : bOrder.id
        };
        temp.sell = sellOrder.id;
        temp.coin_amt = Math.floor((sellOrder.coin_amt * bOrder.coin_amt)/sellcoin_amt);
        tempBuycoin_amt = tempBuycoin_amt - temp.coin_amt;
        /*if (Math.floor((sellOrder.coin_amt * bOrder.coin_amt)/sellcoin_amt) != 0) {
          temp.coin_amt = Math.floor((sellOrder.coin_amt * bOrder.coin_amt)/sellcoin_amt);
          tempBuycoin_amt = tempBuycoin_amt - temp.coin_amt;
        }else{
          if (tempBuycoin_amt > sellOrder.coin_amt) {
            temp.coin_amt = sellOrder.coin_amt;
            tempBuycoin_amt = tempBuycoin_amt - temp.coin_amt;
            temp.full = true;
          }else{
            temp.coin_amt = tempBuycoin_amt;
            tempBuycoin_amt = tempBuycoin_amt - temp.coin_amt;
          }
          
        }*/
        tempMatch.push(temp);
        
      });
      var i = 0;
      while(tempBuycoin_amt != 0){
        tempMatch[i].coin_amt ++;     
        tempBuycoin_amt --;
        if(i < tempMatch.length){
          i++;
        }else{
          i = 0;
        }
      }
      i = 0;  
      matchEntry2.matches = matchEntry2.matches.concat(tempMatch);
      
    })  
  matchResults2.push(matchEntry2);
  matchEntry2 = {
   matches: []
 }
} 
matchEntry = {
  involved: []
};
};
return{
  filterAnN : function(corseOrders){
   corseOrders.forEach(function(corseOrder){
    if (corseOrder.all_or_nothing && corseOrder.buy) {
     buyOrders.push(corseOrder);
   } else if (corseOrder.all_or_nothing && !corseOrder.buy) {
     sellOrders.push(corseOrder);
   }
 })
 },
 populateOrderBook : function(){
   buyOrders.forEach(function (buyOrder) {
    if (buyOrderBooks[buyOrder.per_price] == undefined) {
     buyOrderBooks[buyOrder.per_price] = [];
     buyOrderBooks[buyOrder.per_price].push(buyOrder);
   }else{
     buyOrderBooks[buyOrder.per_price].push(buyOrder);
   }
 });
   sellOrders.forEach(function (sellOrder) {
    if (sellOrderBooks[sellOrder.per_price] == undefined) {
     sellOrderBooks[sellOrder.per_price] = [];
     sellOrderBooks[sellOrder.per_price].push(sellOrder);
   }else{
     sellOrderBooks[sellOrder.per_price].push(sellOrder);
   }
 })
 },
 match : function(){
   for (var key in sellOrderBooks){
    if (buyOrderBooks[key] !== undefined) {
     matchEntry2.per_price = key;
     match_lite_2(buyOrderBooks[key], sellOrderBooks[key], key);

   }else{

   }
 }
},
resultCompile : function(){
  requestServer(matchResults2);
  return {
    jobId: Date.now(),
    results: matchResults2
  }
},
clear : function(){
  sellOrders = [];
  buyOrders = [];
  buyOrderBooks = {};
  sellOrderBooks = {};
  matchResults = [];
  matchEntry = {
    involved: []
  };
  unmatchedOrder = [];
  matchResults2 = [];
}
}

})();

module.exports = matching;


var match_lite = function(bOrders, sOrders, per_price){
 var buycoin_amt = 0;
 var sellcoin_amt = 0;
 bOrders.forEach(function(bOrder){
  buycoin_amt = buycoin_amt+bOrder.coin_amt;
});
 sOrders.forEach(function(sOrder){
  sellcoin_amt = sellcoin_amt+sOrder.coin_amt;
});

 if (buycoin_amt > sellcoin_amt) {
  sOrders.forEach(function(sOrder){

   bOrders.forEach(function(buyOrder){
    transfered = Math.floor((buyOrder.coin_amt * sOrder.coin_amt)/buycoin_amt);
    matchEntry.involved.push({
     id: buyOrder.id,
     coin_amt: transfered
   })
  });
   matchResults.push(matchEntry);
 })		
}else{
  bOrders.forEach(function(bOrder){
   matchEntry.fulfilled = bOrder;
   bOrders.forEach(function(sellOrder){
    transfered = Math.floor((sellOrder.coin_amt * bOrder.coin_amt)/sellcoin_amt);
    matchEntry.involved.push({
     id: sellOrder.id,
     coin_amt: transfered
   })
  });
   matchResults.push(matchEntry);	
 })		
}	
matchEntry = {
  involved: []
};
}


