var request=require('request');
var crypto = require('crypto');
var url='https://api.bitfinex.com/v1';
var wsUrl='wss://api2.bitfinex.com:3000/ws';
//var ws={};
var WebSocket = require('ws');
//var io = require('socket.io')(ws);
module.exports=function(key, secret){
    var self=this;
    var index={
        BTCUSD:{
            historicalURL:'https://www.quandl.com/api/v1/datasets/BCHARTS/BITFINEXUSD.json',
            
        },
        LTCUSD:{
            historicalURL:'https://www.quandl.com/api/v3/datasets/BTCE/USDLTC.json'
        },
        LTCBTC:{
            historicalURL:'https://www.quandl.com/api/v3/datasets/BTCE/BTCLTC.json'
        }
    };
    self.symbols=[];
    var baseRequest = request.defaults({
        headers: {
            'X-BFX-APIKEY': key,
        },
        baseUrl: url
    });
    self.socket="";
    
    self.getSymbols(callback){
        var options={
            url:url+'/symbols';
        }
        request.get(options, function(err, res, body){
            self.symbols=JSON.parse(body);
            var n=self.symbols.length;
            for(var i=0; i<n; i++){
                if(!index[self.symbols[i]]){
                    index[self.symbols[i]]={};
                }
                self.getWalletHistory(self.symbols[i]);//check callback here
                if(index[self.symbols[i]].historicalURL){
                    request.get({url:index[self.symbols[i]].historicalURL}, function(err, res, body){
                         //send to client right here!
                        console.log(res);
                        //client.send(body)
                    });
                }
            }
            callback();
        });
    }
    
    self.getWalletHistory=function(asset, callback){
        var payload = {
            "request":  '/v1/history',
            "currency":asset,
            "nonce": Date.now().toString()
            //"limit_trades": 120
        };
        payload = new Buffer(JSON.stringify(payload)).toString('base64');
        var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
        var options = {
            url:  "/history",
            headers: {
                'X-BFX-PAYLOAD': payload,
                'X-BFX-SIGNATURE': signature
            },
            body: payload
        };
        baseRequest.post(options, function(err, res, body) {
            console.log(body);
            body=JSON.parse(body);
            //callback(body);
        });
    }
    self.startWS=function(callback){
        self.socket=new WebSocket(wsUrl);
        self.socket.on('open', function() {
            loginWS();
        });
        self.socket.on('message', function(msg){
            var data=JSON.parse(msg);
            //console.log(data);
            if(data.event){
                if(data.pair){
                    self.connections[data.chanId]=data;
                }
                else if(data.event==='auth'){
                    self.loginInformation=data;
                    var n=self.symbols.length;
                    for(var i=0; i<n; i++){
                        self.getWSTicker(self.symbols[i]);
                    }
                }
            }
            else if(callback){
                callback(data, self.socket);
            }
        });
    };
    function loginWS(){
        var payload = 'AUTH' + (new Date().getTime());
        var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
        self.socket.send(JSON.stringify({
            event: "auth",
            apiKey: api_key,
            authSig: signature,
            authPayload: payload
        }));  
    };
    self.getWSTicker=function(pair){
        self.socket.send(JSON.stringify({
            "event": "subscribe",
            "channel": "ticker",
            "pair": pair
        }));  
    }
    
}
    
       
}











 /*self.getPortfolioHistory=function(asset, callback){
        var payload = {
            "request":  '/v1/history',
            "currency":asset,
            "nonce": Date.now().toString()
            //"limit_trades": 120
        };
        payload = new Buffer(JSON.stringify(payload)).toString('base64');
        var signature = crypto.createHmac("sha384", api_secret).update(payload).digest('hex');
        var options = {
            url:  "/history",
            headers: {
                'X-BFX-PAYLOAD': payload,
                'X-BFX-SIGNATURE': signature
            },
            body: payload
        };
        baseRequest.post(options, function(err, res, body) {
            //console.log(body);
            body=JSON.parse(body);
            body.sort(function(a, b){
                return a.timestamp-b.timestamp;
            });
            self.getCoinbaseHistory('BTC-USD', body[0].timestamp, body);
            //callback(body);
        });
    }*/
    /*self.getCoinbaseHistory=function(index, start, balanceHistory, callback){
        var currDate=new Date();
        var totalTime=currDate.getTime()/1000-start;
        var candle=Math.ceil(totalTime/200);//200 is the most I can request from coinbase
        console.log(candle);
        
        
        //end=new Date((start+candle*200)*1000).toISOString();
        start=new Date(start*1000).toISOString();
        currDate=currDate.toISOString();
        var options={
            url:'https://api.exchange.coinbase.com/products/'+index+'/candles',
            qs:{
                start:start,
                end:currDate,
                granularity:candle,
            },
            headers: {
                'User-Agent': 'request'
            }
        }
        request.get(options, function(err, res, body) {
            body=JSON.parse(body);
            console.log(balanceHistory);
            var index=numeraires[balanceHistory[0]['currency']]['USD'].index;
            var n=body.length;
            var m=balanceHistory.length;
            var i=n-1;
            var j=0;
            var stillMoreData=true;
            var data=[];
            
            
            var totalLength=n+m;
            while(data.length<totalLength){
                var dateIndex=body[i][0];
                //var valueIndex=0;
                //var valueBalance=0;
                var valueIndex=body[i][3];
                var dateBalance=balanceHistory[j].timestamp;
                var valueBalance=balanceHistory[j].balance;
                //console.log(j);
                console.log(valueIndex);
                if(dateIndex===dateBalance){
                    i=(i===0?i:i-1);
                    j=(j===m-1?j:j+1);
                    totalLength--; //
                }
                else if(j===(m-1)){
                    ///data.push([dateIndex, numeraires[balanceHistory[0].currency]['USD'].convert(valueBalance, valueIndex), valueIndex]);
                    i=(i===0?i:i-1);
                    
                }
                else if(i===(n-1)){
                    ///data.push([dateIndex, numeraires[balanceHistory[0].currency]['USD'].convert(valueBalance, valueIndex), valueIndex]);
                    j=(j===m-1?j:j+1);
                    
                }
                else if(dateIndex<dateBalance){
                    //data.push([dateIndex, numeraires[balanceHistory[0].currency]['USD'].convert(valueBalance, valueIndex), valueIndex]);
                    j=(j===m-1?j:j+1);
                }
                else if(dateIndex>dateBalance){
                    //data.push([dateIndex, numeraires[balanceHistory[0].currency]['USD'].convert(valueBalance, valueIndex), valueIndex]);
                    i=(i===0?i:i-1);
                }
                data.push([dateIndex, numeraires[balanceHistory[0].currency]['USD'].convert(valueBalance, valueIndex), valueIndex]);
                
                //if(body[i][3]
            }
            
            //console.log(body.length);
            //console.log(data);
        });
    }*/
   /* self.getTradeHistory=function(index, callback){
        var payload = {
            timestamp:false
            //"limit_trades": 120
        };
        var options = {
            url:  url+"/trades/"+index,
            qs: payload
        };
        request.get(options, function(err, res, body) {
            callback(body);
        });
    }*/