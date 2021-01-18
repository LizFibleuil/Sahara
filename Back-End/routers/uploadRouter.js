import express from 'express';
import multer from 'multer';
import { isAdmin, isAuth } from '../utils';

/* This creates the storage where the images would live in. Disk Storage means that we'll upload a file in the local server of the computer. */
/* const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

const uploadRouter = express.Router();

uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
    res.status(201).send({ image: `/${req.file.path}` });
}); */

const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'uploads/');
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}.jpg`);
    },
  });
  const upload = multer({ storage });
  const uploadRouter = express.Router();
  uploadRouter.post('/', isAuth, isAdmin, upload.single('image'), (req, res) => {
    res.status(201).send({ image: `/${req.file.path}` });
  });

export default uploadRouter;
