import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';


export const signup = async (req, res, next) =>{
    const { username, email, password } = req.body;
    const saltRounds = 10; 
    //syn password 
    
    try{
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        
        await newUser.save();    
        res.status(201).json("User created successfully!");
    
    } catch (error){
        next(error);
        // next(errorHandler (550, 'error from the function'));
    }

};


export const signin = async(req, res, next) =>{
    const {email, password} = req.body;
    try{
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler (404, 'User not found'));
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler (401, 'Wrong credentials!'));

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;    //avoid password return

        res.cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);

    }catch (error){
    next(error);      
    }


};