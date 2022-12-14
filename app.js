const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// CREATE
app.post('/insert', (request, response) => {
  //console.log(request.body);
  const {userId, budgetId, status, summary, desc, department, sponsor} = request.body;
  const db = dbService.getDbServiceInstance();

  const appResult = db.insertNewApp(userId, budgetId, status, summary, desc, department, sponsor);

  appResult
  .then(data => response.json({data : data}))
  .catch(err => console.log(err));

}); // OK

// READ
app.get('/get', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
  .then(data => response.json({data: data}))
  .catch(err => console.log(err));
}); //OK

// get by filter
app.get('/search', (request, response) => {
  const db = dbService.getDbServiceInstance();
  const filter = request.query;

  const result = db.searchBy(filter);

  result
  .then(data => response.json({data: data}))
  .catch(err => console.log(err));
}); // FIX? localhost returns api correctly...

// UPDATE
app.patch('/update', (request, response) => {
  const {app_id, summary, description, department, sponsor} = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.updateRowById(app_id, summary, description, department, sponsor);

  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
}); // OK

// DELETE
app.delete('/delete/:id', (request, response) => {
  const {id} = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
  .then(data => response.json({success : data}))
  .catch(err => console.log(err));
}); // OK

app.listen(process.env.PORT, () => console.log('app is running'));