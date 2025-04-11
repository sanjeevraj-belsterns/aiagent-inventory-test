import { UserModel } from "../models/user.js";
import ts from "../utils/tokenServices.js"

const signIn = async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      const hashedPassword = await ts.hashPassword(req.body.password);
      req.body.password = hashedPassword;
      await UserModel.create(req.body);
      res.status(200).send({
        message: "User signIn succssful!",
      });
    } else {
      res.status(400).send({
        message: `User with ${req.body.email} already exists!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const logIn = async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (await ts.hashCompare(req.body.password, user.password)) {
        const token = await ts.createToken({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user._id,
          role: user.role,
        });
        res.status(200).send({
          message: "Login Successful",
          user,
          token,
        });
      } 
      else {
        res.status(400).send({
            message: "Incorrect Username or password!",
        });
      }
    }
    else {
        res.status(500).send({
            message : 'User not found!'
        });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!!",
    });
  }
};

export default {
  signIn,
  logIn,
};
