import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { generateToken, isAuth } from '../utils';

const userRouter = express.Router();

/* This router creates the admin user in the database (created by the model file) */
userRouter.get('/createadmin', expressAsyncHandler(async (req, res) => {
    try {
        const user = new User({
            name: 'admin',
            email: 'admin@example.com',
            password: 'sahara',
            isAdmin: true,
        });
        const createdUser = await user.save();
        res.send(createdUser);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}));

/* This router helps the user signin. It checks to see if there's a valid user with the submitted information already in the database */
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email, /* we use req.body because we are accessing the data that is send from Front-End */
        password: req.body.password, /* req.body is thanks to body-parser */
    });
    if (!signinUser) {
        res.status(401).send({ message: 'Invalid Email or Password' });
    } else {
        res.send({
            _id: signinUser._id,
            name: signinUser.name,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: generateToken(signinUser),
        });
    }
}));

/* This router creates a new user and places it into the database */
userRouter.post('/register', expressAsyncHandler(async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    const createdUser = await user.save();
    if (!createdUser) {
        res.status(401).send({ message: 'Invalid User Data' });
    } else {
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: generateToken(createdUser),
        });
    }
}));

/* This router updates the information of the existing user in the database */
userRouter.put('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(401).send({ message: 'User Not Found' });
    } else {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser),
        });
    }
}));

export default userRouter;
