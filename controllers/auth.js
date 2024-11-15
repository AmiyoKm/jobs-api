const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const register = async (req, res) => {
  // const {name , email , password} = req.body
  // const salt = await bcryptjs.genSalt(10)
  // const hashedPassword = await bcryptjs.hash(password , salt)
  // const tempUser = {name , email , password : hashedPassword}
  // if(!name || !email || !password){
  //     throw new BadRequestError('Please provide all values')
  // }
  console.log(req.body);

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  console.log(token);
  
  
  res.status(StatusCodes.CREATED).json({ user , token});
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
}
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user : {name : user.name },token})
}

module.exports = { register, login };
