var mysql = require('mysql2');
var util = require('util');

// conexión a la base de datos mediante un pool 
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER, 
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    url: process.env.MYSQL_URL,
    port: process.env.MYSQLPORT

    //host: process.env.MYSQL_HOST,
    //user: process.env.MYSQL_USER, 
    //password: process.env.MYSQL_PASSWORD,
    //database: process.env.MYSQL_DB_NAME
   
})

pool.query = util.promisify(pool.query);
module.exports = pool;
