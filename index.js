const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('/Users/anusha/Desktop/Sharpener/appointment_booking_node+db/util/database');
const express = require('express');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

async function get_data_from_db(){
  const users = await db.execute('select * from appointment_users');
  return users
}

app.get('/', async (req,res,next) => {
  const user_list = await get_data_from_db();
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json(user_list[0]);
  } else {
    res.render('index', { users: user_list[0] });
  }
})

app.post('/', (req,res,next) => {
  console.log(req.body.data)
  const Name = req.body.data[0]
  const Email = req.body.data[1]
  const Phone = req.body.data[2]
  const Date = req.body.data[3]
  const Time = req.body.data[4]
  db.execute('INSERT INTO appointment_users (name,email,phone,date,time) VALUES (?,?,?,?,?)', [Name, Email, Phone, Date, Time])
  res.redirect('/');
});

app.post('/delete', (req,res,next) => {
  const ID = req.body.id
  db.execute('DELETE FROM appointment_users WHERE user_id = ?', [ID])
  .then(() => {
    res.redirect('/')
    // res.sendStatus(200); // Successful deletion
  })
  .catch(error => {
    console.error('Error executing the query:', error);
    res.sendStatus(500); // Internal Server Error
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
