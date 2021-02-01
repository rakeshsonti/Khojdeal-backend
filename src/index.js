const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const session_secret = "Khojdeal";
const cors = require("cors");
const SALT = 10;
//Express is a minimal and flexible Node. js web application framework that provides a robust set of
//features for web and mobile applications.
const express = require("express");
const app = express();
//midlleware for parsing body
//CORS is shorthand for Cross-Origin Resource Sharing. It is a mechanism to allow or restrict
//requested resources on a web server depend on where the HTTP request was initiated.
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:3000",
   })
);

//add a property session to req //internally handle al encrption/ decrption
app.use(
   session({
      secret: session_secret,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
   })
);
app.use(express.json());
//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships
// between data, provides schema validation, and is used to translate between objects in code and the
// representation of those objects in MongoDB.
const mongoose = require("mongoose");
const port = 9999;
//connection
const conn_url = "mongodb://localhost:27017/Khojdeal";
const db = mongoose.createConnection(conn_url, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

//database schema
const empSchema = new mongoose.Schema({
   EMPID: String,
   EMPNAME: String,
   DOJ: String,
   MOBILENO: String,
   STATUS: String,
   STATE: String,
   CITY: String,
   ADDEDON: String,
   UPDATEDON: String,
   USERSTATUS: String,
   REASON: String,
   SOURCE: String,
});
const userSchema = new mongoose.Schema({
   name: String,
   email: String,
   password: String,
});
//model for employee
const employee = db.model("employees", empSchema);
const user = db.model("Users", userSchema);

const isNullOrUndefined = (value) => {
   return value === undefined || value === null;
};
//save data of employee into data
app.post("/saveData", async (req, res) => {
   const { obj } = req.body;
   const newemployee = new employee(obj);
   await newemployee.save();
   res.send("employee saved!");
});
const AuthMiddleware = async (req, res, next) => {
   if (
      isNullOrUndefined(req.session) ||
      isNullOrUndefined(req.session.userId)
   ) {
      res.status(401).send({ err: "not logged in" });
   } else {
      next();
   }
};
//------------------------------------
app.post("/userData", AuthMiddleware, async (req, res) => {
   const bd = req.body;
   const users = await employee.find({
      USERSTATUS: bd.USERSTATUS,
      DOJ: bd.DOJ,
   });
   res.send({ users: users });
});
app.get("/allActiveUser", AuthMiddleware, async (req, res) => {
   const allActiveUser = await employee.find({ STATUS: "active" }).count();
   res.send({ success: allActiveUser });
});
app.post("/allUser", AuthMiddleware, async (req, res) => {
   const { date } = req.body;
   const users = await employee.find({ DOJ: date });
   res.send({ user: users });
});
app.get("/allUserCount", AuthMiddleware, async (req, res) => {
   const allUser = await employee.distinct("DOJ");
   const resul2 = await Promise.all(
      allUser.map(async (value, index) => {
         let arr = [];
         arr[0] = value;
         arr[1] = await employee.find({ DOJ: value }).count();
         arr[2] = await employee
            .find({ DOJ: value, USERSTATUS: "added" })
            .count();
         arr[3] = await employee
            .find({ DOJ: value, USERSTATUS: "updated" })
            .count();
         arr[4] = await employee
            .find({ DOJ: value, USERSTATUS: "rejected" })
            .count();
         return arr;
      })
   );
   res.send({ success: resul2 });
});

app.post("/sendEmail", async (req, res) => {
   const { email, name } = req.body;
   const time = new Date();
   const dateString = time.toDateString();
   const timeString = time.toTimeString();
   let arr = [];
   arr[0] = await employee.find().count();
   arr[1] = await employee.find({ USERSTATUS: "added" }).count();
   arr[2] = await employee.find({ USERSTATUS: "updated" }).count();
   arr[3] = await employee.find({ USERSTATUS: "rejected" }).count();
   const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "ram.sonti.999@gmail.com",
         pass: "ram.sonti",
      },
   });
   const mailOptions = {
      from: "ram.sonti.999@gmail.com",
      to: email,
      subject: "Data Parsing update",
      text: `
      Dear Stack holder: ${name},
      Data Parsing Update for  Date: ${dateString} and time: ${timeString}.
      Total number of User(s) Added: ${arr[1]}
      Total User(s) Updated in the system: ${arr[2]}
      Total User(s) Rejected in the system: ${arr[3]}
      Total Active users in the system as of now : ${arr[0]}
      Warm regards
      Admin Team`,
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log("Email sent: " + info.response);
      }
   });
});
//---------------------------------
app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   const existingUser = await user.findOne({ email });
   if (isNullOrUndefined(existingUser)) {
      res.status(401).send({ err: `username/password don't match` });
   } else {
      const hashedPwd = existingUser.password;
      if (bcrypt.compareSync(password, hashedPwd)) {
         req.session.userId = existingUser._id;
         res.status(200).send({
            success: `log in `,
         });
      } else {
         res.status(401).send({
            err: `username/password don't match`,
         });
      }
   }
});
app.post("/signup", async (req, res) => {
   const { name, email, password } = req.body;
   const existingUser = await user.findOne({ email });
   if (!isNullOrUndefined(existingUser)) {
      res.status(401).send("username already exist");
   } else {
      const hashPwd = bcrypt.hashSync(password, SALT);
      const newUser = new user({
         name,
         email,
         password: hashPwd,
      });
      await newUser.save();
      req.session.userId = newUser._id;
      res.status(201).send({
         success: `sign up`,
      });
   }
});
app.get("/logout", async (req, res) => {
   if (!isNullOrUndefined(req.session)) {
      req.session.destroy(() => {
         res.sendStatus(200);
      });
   } else {
      res.sendStatus(200);
   }
});
app.get("/getName", async (req, res) => {
   const user1 = await user.findById({ _id: req.session.userId });
   res.send({ user: user1 });
});
app.get("/userinfo", AuthMiddleware, async (req, res) => {
   if (req.session.userId) res.send();
   else res.status(401).send();
});
app.listen(port, () => {
   console.log(`App is listening on port ${port}.....`);
});
