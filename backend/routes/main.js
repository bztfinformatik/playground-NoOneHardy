// moudule providing objects and functions for routing
const express = require("express");

// utility to handle file uploads
const multer = require("multer");

// import controller functions
const mountainCtrl = require("../controllers/mountain");
const userCtrl = require("../controllers/user");
const miscCtrl = require("../controllers/misc");


// define storage location and filename for uploaded image files
const imgStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public");
  },
  filename(req, file, cb) {
    const fileExt = file.mimetype.split("/")[1];
    filename = `${req.params.mntid}.${fileExt}`;
    cb(null, filename);
  },
});
// file filter function: accept only images
const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// create a multer object to handle uploaded files
const upload = multer({ storage: imgStorage, fileFilter: filter }).single(
  "image"
);

const router = express.Router();


router.get("/users/:userid/mnts", mountainCtrl.getAllUserMountainIds);
router.get("/users/:userid/mnts/:mntid", mountainCtrl.getUserMountain);
router.post("/users/:userid/mnts", mountainCtrl.addUserMountain);
router.put("/users/:userid/mnts/:mntid/img", upload, mountainCtrl.addUserMountainImage);
router.put("/users/:userid/mnts/:mntid", mountainCtrl.updateUserMountain);
router.delete('/users/:userid/mnts/:mntid', mountainCtrl.deleteUserMountain);

router.post('/login', userCtrl.login);
router.get('/users', userCtrl.filterUsers);
router.post('/users', userCtrl.signup);
router.delete('/users/:id', userCtrl.deleteUser);
router.get('/users/:id', userCtrl.getUser);




router.get("/mnts", mountainCtrl.getAllPublicMountainIds);
router.get("/mnts/:id", mountainCtrl.getPublicMountain);
router.post("/mnts", mountainCtrl.addPublicMountain);
router.put("/mnts/:mntid/img", upload, mountainCtrl.addPublicMountainImage);
router.put("/mnts/:id", mountainCtrl.updatePublicMountain);
router.delete('/mnts/:id', mountainCtrl.deletePublicMountain);


router.get("/", miscCtrl.default);
router.get('/avatars', miscCtrl.getAvatars);

// for testing purpose only, not used by frontend application
router.get('/images', miscCtrl.getImage);

module.exports = router;
