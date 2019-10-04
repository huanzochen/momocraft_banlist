import { url, username, database, password } from './dbinformation.js' 

// get the client
const mysql = require('mysql2/promise');

// create the pool to database
const pool = mysql.createPool({
  host: url,
  user: username,
  database: database,
  password: password
});



pool.query('SELECT * FROM litebans_momocraftban.litebans_bans;',
  function(err, results, fields) {
    //console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
  }
);




export { pool };


