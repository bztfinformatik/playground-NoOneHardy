// importing genereal modules

//load environment
require("dotenv").config();

// module for handling http requests and responses and managing routes
const express = require("express");

// helper for concatinating paths
const path = require("path");

// importing self-developed moudules
const routes = require("./routes/main");

// importing log utilities
const logger = require("./util/log");

// import model classes
const Mountain = require("./models/mountain");
const User = require("./models/user");

const api = express();

// initialize body-parser for JSON-format
api.use(express.json());
// initialize handling file uploads
// const upload = multer({ dest: "public" }).single("image");
// api.use(upload);

// initialize database connection an orm
const db = require("./util/db");

const { sleep } = require("./util/helper");

// get sample data
const sampledata = require("./util/sampledata");
const { env } = require("process");

// get constants
const { STATIC_DIR } = require("./util/const");

// Setting response header to allow cross origin requests
// CORS-Settings.
api.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// set static path for public dirctory
api.use(express.static(path.join(process.cwd(), STATIC_DIR)));

api.use(routes);
// fallback: redirect to / in case there is no routing match
api.use((req, res, next) => {
  res.redirect("/");
});

// error handler sends error message as json
api.use((err, req, res, next) => {
  logger.error(err.message, {
    errno: err.errno,
    error: err,
  });
  res.status(err.statusCode).json({
    errorMessage: err.message,
  });
});

// try to connect to database and start listener
(async () => {
  try {
    // sync database and load sample data while project code is under developement
    // check environment variable NODE_DBSYNC
    if (process.env.NODE_DBSYNC === "true") {
      // polling for ready database
      let isDbReady = false;
      for (let i = 0; i < 5; i++) {
        try {
          await db.authenticate();
          isDbReady = true;
          break;
        } catch (err) {}
        await sleep(10000);
      }

      if (isDbReady) {
        await db.sync({ force: true });
        // load sample mountains
        for (const mountain of sampledata.mountains.features) {
          await Mountain.create({
            id: mountain.properties.id,
            name: mountain.properties.name,
            image: mountain.properties.img,
            elevation: mountain.properties.el,
            hasmountainrailway: mountain.properties.mountainrailway,
            longitude: mountain.geometry.coordinates[0],
            latitude: mountain.geometry.coordinates[1],
          });
        }
        // load sample users
        let testUsers;
        if (process.env.NODE_HASHED_PWD === "true") {
          testUsers = sampledata.users_hashed_pwd;
        } else {
          testUsers = sampledata.users_clear_pwd;
        }

        for (const user of testUsers) {
          await User.create({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            pwd: user.pwd,
            avatar: user.avatar,
            isadmin: user.isadmin
          });
        }
        // associate mountains to users
        for (const userMountain of sampledata.userMountains) {
          await Mountain.update(
            {
              userId: userMountain.userid,
            },
            { where: { id: userMountain.mountainid } }
          );
        }
      } else {
        throw new Error("Database connection could not be established");
      }
    }
  } catch (err) {
    logger.error(err.message, {
      errno: err.errno,
      error: err,
    });
  } finally {
    api.listen(3000);
  }
})();
