/**
 * config/mongodb.js
 *
 * Define your MongoDB connection details
 *
 * */

module.exports = {
  username: 'admin', //MongoDB user (optional)
  password: 'Prt-4Wqs', //MongoDB password (optional)
  host: '127.0.0.1', //Mongo hosts
  port: '27017', //Port
  database: 'awm' //Database name
};

/*
mongodb://admin:<Prt-4Wqs>@cluster0-shard-00-00-u9nof.gcp.mongodb.net:27017,cluster0-shard-00-01-u9nof.gcp.mongodb.net:27017,cluster0-shard-00-02-u9nof.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true
*/
