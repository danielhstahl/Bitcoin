//var key=require("./ROApi.js");
var BFX=require("./BFX.js");
var parseBFX=require("./parseBFX.js");
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//app.use(express.static(__dirname + '/views'));
app.use('/assets', express.static('assets'));
//app.use('/assets', express.static('views'));

server.listen(3000);
//var ws=new ws(ROApi.key, ROApi.secret);
BFX=new BFX();
//parseBFX=new parseBFX();
//BFX.startWS();

/*app.post("/trades", function(req, res){
    BFX.getTrades("BTCUSD", function(data){
        //BFX.getWSTrades();
        //res.send(data);
    });
    
    
});*/

/*app.get("/index", function(req, res){
    res.sendFile(__dirname+'/views/index.html');
    //res.sendFile('index.html');
});
app.get("/server", function(req, res){
    res.sendFile(__dirname+'/views/serverlogin.html');
    //res.sendFile('index.html');
});*/
app.get("/app", function(req, res){
    res.sendFile(__dirname+'/views/app.html');
    //res.sendFile('index.html');
});
/*app.post("/wallet_history", function(req, res){
    BFX.getPortfolioHistory('BTC', function(data){
        res.send(data);
    }); 
});
app.post("/trade_history", function(req, res){
    BFX.getTradeHistory('BTCUSD', function(data){
        res.send(data);
    });  
});*/
io.on('connection', function (socket) {
    var isAuth=false;
    var chanId=0;
    var userId=0;
    var numeraire='USD';
    //BFX.getPortfolioHistory('BTC');
    BFX.startWS(function(data, wsSocket){
        BFX.getSymbols(function(){});
        BFX.parseWallet(data, numeraire);
        BFX.parseTicker(data, numeraire);
        socket.emit('portVal', BFX.PortfolioValue);
        socket.emit('indexVal', BFX.indexValues);
        //}
    });
    socket.on('numeraire', function(data){
        numeraire=data.value;
    });
    
    
    
  /*socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });*/
});


/*var BFX= require('bitfinex-api-node');
var BFXws = BFX.websocket;
var BFXrest = BFX.rest;
console.log(BFX);
console.log(BFXws);
console.log(BFXrest);*/