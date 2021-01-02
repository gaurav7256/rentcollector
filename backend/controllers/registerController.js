var User = require('../models').User;
const UserService = require('../services/user.service');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let jwt = require('jsonwebtoken');
let config = require('../config');

var multer = require('multer');
const DIR = './uploads';
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

exports.register = (req, res) => {
  try {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        const user = '';
        return res.status(400).json({
          'Success': false,
          msg: "res.__('server_error')",
          user
        });
      } else {
        req.body.password = hash;
        const user = UserService.createUser(req.body);
        return res.status(200).json({
          'Success': true,
          data: user
        });
      }
    });
  } catch (err) {
    const user = '';
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }
};

exports.login = async (req, res) => {
  try {
    const userDBHashPassword = await User.findOne({
      where: { email: req.body.useremail }
    });
    if (userDBHashPassword) {
      if (bcrypt.compareSync(req.body.password, userDBHashPassword.password)) {
        let token = jwt.sign({ username: req.body.username },
          config.secret,
          {
            expiresIn: '1h' // expires in 24 hours
          }
        );

        return res.status(200).json({
          'Success': true,
          data: userDBHashPassword,
          token: token
        });
      } else {
        const user = '';
        return res.status(400).json({
          'Success': false,
          msg: "User Password not matched",
          user
        });
      }

    } else {
      const user = '';
      return res.status(400).json({
        'Success': false,
        msg: "User not found",
        user
      });
    }

  } catch (err) {
    const user = '';
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    if (allUsers) {
      return res.status(200).json({
        'Success': true,
        data: allUsers
      });
    } else {
      const user = '';
      return res.status(400).json({
        'Success': false,
        msg: "User not found",
        user
      });
    }
  } catch (err) {
    const user = '';
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log("req.body---->", req.body);
  } catch (err) {
    const user = '';
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log("rrrrrrrrrrrrrr------------->", req.body);
    var imageDetail = upload.single('photo');
    return res.status(200).json({
      'Success': true,
      data: imageDetail
    });
    const user = UserService.updateUser(req.body);
        return res.status(200).json({
          'Success': true,
          data: user
        });
  } catch (err) {
    const user = err;
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }
};

exports.loginUserDetail = async (req, res) =>{
  try {
    const user = await User.findOne({
      where: { id: 1 }
    });
    if (user) {
      return res.status(200).json({
        'Success': true,
        message: 'User details found',
        user: user
      });

    } else {
      const user = '';
      return res.status(400).json({
        'Success': false,
        msg: "User detail's not found",
        user
      });
    }

  } catch (err) {
    const user = '';
    return res.status(500).json({
      'Success': false,
      msg: err,
      user
    });
  }

};