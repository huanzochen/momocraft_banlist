import { pool } from '../util/dbconnect.js'

// READ
function getBanList() {
    return pool.query('SELECT * FROM litebans_momocraftban.litebans_bans WHERE id < 10;');
}



export { getBanList }


