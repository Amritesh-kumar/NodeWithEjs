const db = require('../config/db.js');
const sql = require('mssql');
const bcrypt = require('bcrypt');

async function addUser(username, passwordHash) {
    try {
      const pool = await db;
      await pool.request()
        .input('username', sql.NVarChar, username)
        .input('passwordHash', sql.NVarChar, passwordHash)
        .query('INSERT INTO Users (name, password) VALUES (@Username, @PasswordHash)');
    } catch (err) {
      console.error('Error inserting user:', err);
      throw err;
    } finally {
      sql.close();
    }
  }
  

module.exports = {addUser };