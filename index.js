var http    = require('http')
var sqlite  = require('sqlite3').verbose()
var express = require('express')

var app    = express()
var server = http.createServer(app)
var db     = new sqlite.Database('database.db')

db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, username TEXT)')

app.get('/add/id=:id&username=:name', function(req, retorno){
  db.serialize(()=>{
    db.run('INSERT INTO emp(id, username) VALUES(?, ?)', [req.params.id, req.params.name], function(err) {
      if (err) {
        console.log(err.message)
        return JSON.stringify({
                "msg"     : err.message,
                "response": "error"
                })
              }
      retorno.send(JSON.stringify({
        "id"      : req.params.id,
        "name"    : req.params.name,
        "response": "ok",
      })
      )
    })
  })
})

app.get('/get/id=:id', function(req, retorno){
  db.serialize(()=>{
    db.each('SELECT id ID, username USERNAME FROM emp WHERE id =?', [req.params.id], function(err,row){
      if(err){
        console.log(err.message)
        return JSON.stringify({
                "msg"     : err.message,
                "response": "error"
                })
              }
      retorno.send(JSON.stringify({
        "id"      : row.ID,
        "name"    : row.NAME,
        "response": "ok",
      })
      )
    })
  })
})

server.listen(5000, function(){console.log("Servidor rodando na porta: 5000")})