var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGOLAB_URI || 'mongodb://localhost/library'

var app = express();
app.use(bodyParser.json());

app.get('/', function(req,res){
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    res.send("Connected correctly to server.");
    db.close();
  });
});

app.get('/book/:name',function(req,res){
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('books').find({'name':req.params.name}).toArray(function(err,docs){
      assert.equal(err,null);
      res.send({data:docs});
    });
  });
});

app.get('/book',function(req,res){
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('books').find().toArray(function(err,docs){
      assert.equal(err,null);
      res.send({data:docs});
    });
  });
});

app.post('/book',function(req,res){
  mongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    db.collection('books').insertOne(req.body,
    function(err,result){
      assert.equal(null,err);
      res.send(result);
    });
  });
});

app.put('/book/:name',function(req,res){
  mongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    db.collection('books').updateOne(
      {'name':req.params.name},
      {
        $set:req.body
      },
    function(err,result){
      assert.equal(null,err);
      res.send(result);
    });
  });
});

var server = app.listen(process.env.PORT || 5000,function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
