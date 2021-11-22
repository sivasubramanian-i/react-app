var express = require("express");
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var config = require("./config/db.config");
var jwt = require('jsonwebtoken');
var auth = require("./app/routes/auth.routes");
var employee = require("./app/routes/employee.routes");
var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//connect database
mongoose.connect(config.MONGO_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB ...'))
.catch(err => console.error('Could not connect to MongoDB:‌', err));

app.use('/auth', auth);

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/auth/login" || req.path == "/auth/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, config.JWT_SECRET, function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})


app.use('/employee', employee);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: true,
//     title: 'Apis'
//   });
// });


app.listen(8000, () => {
  console.log("Server is Runing On port 8000");
});
