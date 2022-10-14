const express = require('express');
const app = express();
const low = require('lowdb');
const fs = require('lowdb/adapters/FileSync');
const adapter = new fs('db.json');
const db = low(adapter);
const cors = require('cors');
const { faker } = require('@faker-js/faker');

// allow cross-origin resource sharing (CORS)
app.use(cors());

// data parser - used to parse post data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from public directory
// -------------------------------------------
app.use(express.static('public'));

// init the data store
db.defaults({ users: [] }).write();

let port = process.env.PORT || 3000;

// account endpoints
app.get('/accounts', (req, res) => {
    const data = db.value()
    res.send( data )
})

app.post('/accounts', (req, res) => {
    // setup
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          const date = faker.date.past(
            50,
            new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)")
          );

          // random data
          const name = faker.name.findName(firstName, lastName);
          const email = faker.internet.email(firstName, lastName);
          const username = faker.internet.userName(firstName, lastName);
          const password = faker.internet.password();
          const phone = faker.phone.phoneNumber();
          const streetaddress = faker.address.streetAddress();
          const citystatezip =
            faker.address.city() +
            ", " +
            faker.address.stateAbbr() +
            " " +
            faker.address.zipCode();
          const latitude = faker.address.latitude();
          const longitude = faker.address.longitude();
          const avatar = faker.internet.avatar();
          const dob =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();

          // user data object for post
          const user = {
            name,
            dob,
            email,
            username,
            password,
            phone,
            streetaddress,
            citystatezip,
            latitude,
            longitude,
            avatar,
          };
            db.get('users').push(user).write();
    console.log(db.get('users').value());
    res.send({ added: user });

})

// return all users
app.get('/data', function (req, res) {
    res.send(db.get('users').value());
});

// add user
app.post('/add', function (req, res) {
    var user = {
        'name': req.body.name,
        'dob': req.body.dob,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
        'phone': req.body.phone,
        'streetaddress': req.body.streetaddress,
        'citystatezip': req.body.citystatezip,
        'latitude': req.body.latitude,
        'longitude': req.body.longitude,
        'avatar': faker.internet.avatar() 
    }
    db.get('users').push(user).write();
    console.log(db.get('users').value());
    res.send(db.get('users').value());
});

// start server
// -----------------------
app.listen(port, function () {
    console.log(`Running on port ${port}`);
});
