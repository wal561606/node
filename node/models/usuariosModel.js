var pool = require('./bd');
var md5 = require('md5');

//Busca un determinado usuario en la BD mediante su usuario y password
async function getUserByUsernameAndPassword(user, password) {
    try { 
        var query = "select * from usuarios where usuario = ? and password = ? limit 1";
        var rows = await pool.query(query, [user, md5(password)]); 
        return rows[0];
    } catch (error) { 
        throw error    
    }

}

// pool.query('SELECT * FROM usuarios').then(function(resultados){
//     console.log(resultados);
// });

// var obj = {
//     usuario:'Pedro',
//     password:'12345'
// }
// pool.query('INSERT INTO usuarios SET ?', [obj]).then(function(resultados){
//     console.log(resultados)
// });

module.exports = { getUserByUsernameAndPassword }