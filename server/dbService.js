const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
}); //OK

connection.connect((err) => {
  if(err){
    console.log(err.message);
  }
  console.log('db ' + connection.state);
}); // OK

// class that contains functions for CRUD operations
class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  } // OK

  async getAllData(){
    try{
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM apps;";

        connection.query(query, (err, results) => {
          if(err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return response;
    }catch (error) {
      console.log(error);
    }
  } // OK

  async insertNewApp(userId, budgetId, statusId, summary, desc, department, sponsor) {
    try {
      const dateAdded = new Date();
      const datePaid = null;
      const appId = await new Promise((resolve, reject) => {
          const query = "INSERT INTO apps (user_id, budget_id, app_date, app_status_id, summary, description, department, sponsor, paid_date) VALUES (?,?,?,?,?,?,?,?,?);";

          connection.query(query, [userId, budgetId, dateAdded, statusId, summary, desc, department, sponsor, datePaid] , (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result.appId);
          })
      });
      return {
          appId : appId,
          userId : userId,
          dateAdded : dateAdded,
          statusId : statusId,
          summary : summary,
          desc : desc,
          department : department,
          sponsor : sponsor,
          datePaid : datePaid
      };
  } catch (error) {
      console.log(error);
  }
  } // OK

  async deleteRowById(id) {
    try{
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM apps WHERE app_id = ?";

        connection.query(query, [id], (err, result) => {
          if(err) reject(new Error(err.message));
          resolve(result.affectedRows);
        })
      });
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  } // OK

  async updateRowById(id, summary, description, department, sponsor){
    try {
      id = parseInt(id, 10); 
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE apps SET summary = ?, description = ?, department = ?, sponsor = ? WHERE app_id = ?";

        connection.query(query, [summary, description, department, sponsor, id] , (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.affectedRows);
        })
      });
      return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
  } // OK

  async searchBy(filter) {
    try {
      const response = await new Promise((resolve, reject) => {
        let query = "SELECT * FROM apps WHERE ";
        for (let key in filter) {
          query += key + " = '" + filter[key] + "'";
        } 
        query += ";";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        })
      });
      return response;
    }catch (error) {
      console.log(error);
    }
} // OK

}

module.exports = DbService;
