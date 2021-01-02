var express = require("express"),
    port = process.env.PORT || 8000;

let middleware = require("./middleware");

var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// set cros for cross domain hits
app.use(cors());


var register_controller = require("./controllers/registerController");

app.post("/users/register", register_controller.register);
app.post("/users/authenticate", register_controller.login);
app.get("/users", register_controller.allUsers);
app.get("/users/:id", middleware.checkToken, register_controller.loginUserDetail);
app.patch("/users/:id", middleware.checkToken, register_controller.updateUser);
app.delete("/users/:id", middleware.checkToken, register_controller.deleteUser);
// app.post("users/profileupload", middleware.checkToken, register_controller.uploadProfilePic);


app.listen(port);