var request=require('request');
var crypto = require('crypto');
var key=require('./ROApi.js');
var api_key=key.key;
var api_secret=key.secret; //get this from db later
var url='https://api.bitfinex.com/v1';
var wsUrl='wss://api2.bitfinex.com:3000/ws';
//var ws={};
var WebSocket = require('ws');
//var io = require('socket.io')(ws);
module.exports=function(){
    var self=this;
    self.socket="";
    self.connections={};
    self.loginInformation={};
    self.indexValues="";
    self.symbols=[];
    //self.tickers=tickersToSubscribeTo||['BTCUSD'];//defaults to BTCUSD
    self.wallets="";
    self.PortfolioValue="";
    var baseRequest = request.defaults({
        headers: {
            'X-BFX-APIKEY': api_key,
        },
        baseUrl: url
    });
    //self.portfolioValue=[];//array of time and positions
    var keyNames={
        ps:{
            keys:["PAIR", "STATUS", "AMOUNT", "PRICE", "MARGIN_FUNDING", "MARGIN_FUNDING_TYPE"],
            type:"Position"
        }, 
        pn:{
            keys:["PAIR", "STATUS", "AMOUNT", "PRICE", "MARGIN_FUNDING", "MARGIN_FUNDING_TYPE"],
            type:"Position"
        }, 
        pu:{
            keys:["PAIR", "STATUS", "AMOUNT", "PRICE", "MARGIN_FUNDING", "MARGIN_FUNDING_TYPE"],
            type:"Position"
        }, 
        pc:{
            keys:["PAIR", "STATUS", "AMOUNT", "PRICE", "MARGIN_FUNDING", "MARGIN_FUNDING_TYPE"],
            type:"Position"
        },    
        ws:{
            keys:["WALLET", "CURRENCY", "BALANCE", "UNSETTLED INTEREST"],
            type:"Wallet",
        },
        wu:{
            keys:["WALLET", "CURRENCY", "BALANCE", "UNSETTLED INTEREST"],
            type:"Wallet",
        },
        os:{
            keys:["ORDER_ID", "PAIR", "AMOUNT", "ORIGINAL_AMOUNT", "TYPE", "STATUS", "PRICE", "AVG_PRICE", "CREATED", "NOTIFY", "HIDDEN"],
            type:"Order"
        },
        on:{
            keys:["ORDER_ID", "PAIR", "AMOUNT", "ORIGINAL_AMOUNT", "TYPE", "STATUS", "PRICE", "AVG_PRICE", "CREATED", "NOTIFY", "HIDDEN"],
            type:"Order"
        },
        ou:{
            keys:["ORDER_ID", "PAIR", "AMOUNT", "ORIGINAL_AMOUNT", "TYPE", "STATUS", "PRICE", "AVG_PRICE", "CREATED", "NOTIFY", "HIDDEN"],
            type:"Order"
        },
        oc:{
            keys:["ORDER_ID", "PAIR", "AMOUNT", "ORIGINAL_AMOUNT", "TYPE", "STATUS", "PRICE", "AVG_PRICE", "CREATED", "NOTIFY", "HIDDEN"],
            type:"Order"
        },
        ts:{
            keys:["TRADE_ID", "PAIR", "TIMESTAMP", "ORDER_ID", "AMOUNT", "PRICE", "TYPE", "PRICE", "FEE", "FEE_CURRENCY"],
            type:"Trade"
        },
        tu:{
            keys:["TRADE_SEQ", "PAIR", "TIMESTAMP", "ORDER_ID", "AMOUNT", "PRICE", "TYPE", "PRICE", "FEE", "FEE_CURRENCY"],
            type:"Trade"
        },
        te:{
            keys:["TRADE_SEQ", "PAIR", "TIMESTAMP", "ORDER_ID", "AMOUNT", "PRICE", "TYPE", "PRICE"],
            type:"Trade"
        }
        
    };
    {"errors":{},"id":11320957,"source_name":"Bitcoin Charts Exchange Rate Data","source_code":"BCHARTS","code":"BITFINEXUSD","name":"Bitcoin Markets (bitfinexUSD)","urlize_name":"Bitcoin-Markets-bitfinexUSD","display_url":"http://www.bitcoincharts.com","description":"Daily Bitcoin exchange rate (BTC vs. USD) on Bitfinex. Updated daily at 6:00pm EST. Data is sourced from http://www.bitcoincharts.com . For other Bitcoin data and charts see our Bitcoin markets page (http://www.quandl.com/markets/bitcoin-data).","updated_at":"2016-01-14T23:01:26.072Z","frequency":"daily","from_date":"2013-03-31","to_date":"2016-01-14","column_names":["Date","Open","High","Low","Close","Volume (BTC)","Volume (Currency)","Weighted Price"],"private":false,"type":null,"premium":false,"data":[["2016-01-
    var pairs={
        BTCUSD:{ 
            historicalURL:'https://www.quandl.com/api/v1/datasets/BCHARTS/BITFINEXUSD.json',
        },
        LTCUSD:{
            historicalURL:'https://www.quandl.com/api/v3/datasets/BTCE/USDLTC.json',
        },
        LTCBTC:{
            historicalURL:'https://www.quandl.com/api/v3/datasets/BTCE/BTCLTC.json',
        }
    };
    var numeraires={
        USD:{ //asset
            BTC:{ //numeraire
                index:"BTCUSD",
                convert:function(value, index){
                    return value/index;   
                },
                convertHistorical:function(value, index){
                    return value/index;
                }
            },
            USD:{//numeraire
                index:"BTCUSD",
                convert:function(value, index){
                    return value;
                },
                convertHistorical:function(value, index){
                    return value;
                }
            },
            LTC:{
                index:"LTCUSD",
                convert:function(value, index){
                    return value/index;
                },
                convertHistorical:function(value, index){
                    return value/index;
                }
            }
        },
        BTC:{
            USD:{
                index:"BTCUSD",
                convert:function(value, index){
                    return value*index;
                },
                convertHistorical:function(value, index){
                    return value*index;
                }
            },
            BTC:{
                index:"BTCUSD", 
                convert:function(value, index){
                    return value;
                },
                convertHistorical:function(value, index){
                    return value;
                }
            },
            LTC:{
                index:"LTCBTC",
                convert:function(value, index){
                    return value*index;
                },
                convertHistorical:function(value, index){
                    return value/index;
                }
            }
        },
        LTC:{
            USD:{
                index:"LTCUSD",
                convert:function(value, index){
                    return value*index;
                },
                convertHistorical:function(value, index){
                    return value*index;
                }
            },
            BTC:{
                index:"LTCBTC", 
                convert:function(value, index){
                    return value*index;
                },
                convertHistorical:function(value, index){
                    return value/index;
                }
            },
            LTC:{
                index:"LTCBTC",
                convert:function(value, index){
                    return value;
                },
                convertHistorical:function(value, index){
                    return value;
                }
            }
        }
    };
    
    /*this.getCurrentPositions=function(data, numeraire){
        var message=self.parseAuthenticated(self.loginInformation.chanId, data);
        if(message&&message.type==='Wallet'){
            var n=message.values.length;
            var totalPortVal=0;
            for(var i=0; i<n; i++){
                var index=numeraires[message.values[i].CURRENCY][numeraire].index;
                i
                totalPortVal+=numeraires[message.values[i].CURRENCY][numeraire].convert(message.values[i].BALANCE, self.indexValue[index].value);
            }
            return totalPortVal;
        }
        else{
            return message;
        }
        //self.portfolioValue=[];
    }*/
    this.getCurrentPortfolioValue=function(numeraire){
        if(self.wallets&&self.indexValues){
            //console.log(self.indexValues);
            /*var n=self.wallets.length;
            var portfolios={};
            //var totalPortVal=0;
            for(var i=0; i<n; i++){
                var index=numeraires[self.wallets[i].CURRENCY][numeraire].index;
                var value=numeraires[self.wallets[i].CURRENCY][numeraire].convert(self.wallets[i].BALANCE, self.indexValues[index].value);
                //console.log(self.wallets[i].BALANCE);
                //console.log(self.indexValues[index].value);
                //portfolios.push({value:value, name:self.wallets[i].WALLET});
                portfolios[self.wallets[i].CURRENCY]={balance:value, name:self.wallets[i].WALLET};
                totalPortVal+=value;
                
            }*/
            
            self.PortfolioValue=[new Date().getTime(), self.wallets, self.indexValues];
            
        }
    }
    this.parseWallet=function(message, numeraire){
        if(self.loginInformation.chanId!==message[0]){
            return;
        }
        var key=message[1];
        if(key==='hb'){
            return;
        }
        if(keyNames[key]!=='Wallet'){
            return;   
        }
        if(!self.wallets){
            self.wallets={};
        }
        if(key==='wu'){
            var msg=message[2];
            self.wallets[msg[1]]=msg[2];
        }
        else{
            var n=message[2].length;
            var msg=message[2];
            for(var i=0; i<n; i++){
                self.wallets[msg[i][1]]=msg[i][2];
            }
        }
        self.getCurrentPortfolioValue(numeraire);
    }
    this.parseTicker=function(message, numeraire){
        if(self.connections[message[0]]&&message[1]!=='hb'){
        //if(self.connections[message[0]]){
            //.log(message[7]);
            //console.log(message);
            if(!self.indexValues){
                self.indexValues={};
            }
            self.indexValues[self.connections[message[0]].pair]=message[7];
        }
        self.getCurrentPortfolioValue(numeraire);
    }
    /*this.parseAuthenticated=function(channel, message){
        if(message[0]!==channel){
            //console.log("wrong channel");
            return;
        }
        var key=message[1];
        if(key==='hb'){ //placeholder to keep the line open..
            return;
        }
        if(!message[2][0]){
            return;
        }
        var n=message[2][0].length;
        if(!keyNames[key]){
            return;
        }
        var nCheck=keyNames[key].keys.length;
        if(n!==nCheck){
            return;
        }
        var values=[];
        var totalAttributes=message[2].length;
        for(var j=0; j<totalAttributes; j++){
            var obj={};
            for(var i=0; i<n; i++){
                obj[keyNames[key].keys[i]]=message[2][j][i];
            }
            values.push(obj);
        }

        return {values:values, type:keyNames[key].type};
    }*/
     self.getSymbols(callback){
        var options={
            url:url+'/symbols'
        }
        request.get(options, function(err, res, body){
            self.symbols=JSON.parse(body);
            var n=self.symbols.length;
            for(var i=0; i<n; i++){
                self.symbols[i]=self.symbols[i].toUpperCase();
                if(!pairs[self.symbols[i]]){
                    pairs[self.symbols[i]]={};
                }
                self.getWalletHistory(self.symbols[i]);//check callback here
                if(pairs[self.symbols[i]].historicalURL){
                    request.get({url:pairs[self.symbols[i]].historicalURL}, function(err, res, body){
                         //send to client right here!
                        var data=JSON.parse(body).data;
                        
                        console.log(data);
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
                    var n=self.tickers.length;
                    for(var i=0; i<n; i++){
                        self.getWSTicker(self.tickers[i]);
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
