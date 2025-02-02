const fs = require("fs");
const path = require("path");
const {glob} = require("glob");

const logger = require("../util/log");
const { isEmpty } = require("../util/helper");
const Mountain = require("../models/mountain");
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INETERNAL_SERVER_ERROR,
  STATIC_DIR,
} = require("../util/const");
const { Op } = require("sequelize");

exports.getHelloWorld = (req, res, next) => {
  res.status(200).json({
    message: "Hello World",
  });
};

function toGeoFeatureObj(resultSet) {
  let mnt = {};
  if (!isEmpty(resultSet)) {
    mnt = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [resultSet.longitude, resultSet.latitude],
      },
      properties: {
        id: resultSet.id,
        name: resultSet.name,
        el: resultSet.elevation,
        img: isEmpty(resultSet.image)
          ? undefined
          : `${process.env.NODE_HOST}/${resultSet.image}`,
        mountainrailway: resultSet.hasmountainrailway,
      },
    };
  }
  return mnt;
}

function removeImage(mntId) {
  const staticDir = path.join(process.cwd(), STATIC_DIR);
  glob(`${mntId}.*`, { cwd: staticDir, absolute: true }, (err, images) => {
    if (err) {
      throw err;
    }
    for (const image of images) {
      fs.unlinkSync(image);
    }
  });
}

exports.getAllPublicMountainIds = async (req, res, next) => {
  try {
    const resultSet = await Mountain.findAll({
      attributes: ["id"],
      where: { userId: { [Op.is]: null } },
    });
    const mntIds = resultSet.map((item) => item.id);
    res.status(HTTP_STATUS_OK).json(mntIds);
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.getAllUserMountainIds = async (req, res, next) => {
  try {
    const resultSet = await Mountain.findAll({
      attributes: ["id"],
      where: { userId: req.params.userid },
    });
    const mntIds = resultSet.map((item) => item.id);
    res.status(HTTP_STATUS_OK).json(mntIds);
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.getPublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    const mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: req.params.id,
      },
    });
    if (!isEmpty(mnt)) {
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.getUserMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    const mnt = await Mountain.findOne({
      where: {
        userId: req.params.userid,
        id: req.params.mntid,
      },
    });
    if (!isEmpty(mnt)) {
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.addPublicMountain = async (req, res, next) => {
  try {
    const resultSet = await Mountain.create({
      name: req.body.name,
      elevation: req.body.elevation,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      hasmountainrailway: req.body.hasmountainrailway,
    });
    res.status(HTTP_STATUS_CREATED).json(toGeoFeatureObj(resultSet));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.updatePublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: req.params.id,
      },
    });
    // console.error(`mnt: ${mnt}`);
    if (!isEmpty(mnt)) {
      if (!isEmpty(req.body.name)) {
        mnt.name = req.body.name;
      }
      if (!isEmpty(req.body.elevation)) {
        mnt.elevation = req.body.elevation;
      }
      if (!isEmpty(req.body.longitude)) {
        mnt.longitude = req.body.longitude;
      }
      if (!isEmpty(req.body.latitude)) {
        mnt.latitude = req.body.latitude;
      }
      if (!isEmpty(req.body.hasmountainrailway)) {
        mnt.hasmountainrailway = req.body.hasmountainrailway;
      }
      await mnt.save();
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.updateUserMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let mnt = await Mountain.findOne({
      where: {
        userId: req.params.userid,
        id: req.params.mntid,
      },
    });
    // console.error(`mnt: ${mnt}`);
    if (!isEmpty(mnt)) {
      if (!isEmpty(req.body.name)) {
        mnt.name = req.body.name;
      }
      if (!isEmpty(req.body.elevation)) {
        mnt.elevation = req.body.elevation;
      }
      if (!isEmpty(req.body.longitude)) {
        mnt.longitude = req.body.longitude;
      }
      if (!isEmpty(req.body.latitude)) {
        mnt.latitude = req.body.latitude;
      }
      if (!isEmpty(req.body.hasmountainrailway)) {
        mnt.hasmountainrailway = req.body.hasmountainrailway;
      }
      await mnt.save();
      httpStatus = HTTP_STATUS_OK;
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.addPublicMountainImage = async (req, res, next) => {
  try {
    // console.log(req.file);
    // console.log(req.params.id);
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let mnt = await Mountain.findOne({
      where: {
        userId: { [Op.is]: null },
        id: req.params.mntid,
      },
    });
    if (!isEmpty(mnt)) {
      mnt.image = req.file.filename;
      await mnt.save();
      httpStatus = HTTP_STATUS_OK;
    } else {
      //remove uploaded file
      removeImage(req.params.mntid);
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;

    //remove uploaded file
    removeImage(req.params.mntid);

    next(err);
  }
};

exports.addUserMountain = async (req, res, next) => {
  try {
    const mnt = await Mountain.create({
      name: req.body.name,
      elevation: req.body.elevation,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      hasmountainrailway: req.body.hasmountainrailway,
      userId: req.params.userid,
    });
    res.status(HTTP_STATUS_CREATED).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    next(err);
  }
};

exports.addUserMountainImage = async (req, res, next) => {
  try {
    // console.log(req.file);
    // console.log(req.params.id);
    let httpStatus = HTTP_STATUS_NOT_FOUND;

    let mnt = await Mountain.findOne({
      where: {
        userId: req.params.userid,
        id: req.params.mntid,
      },
    });
    if (!isEmpty(mnt)) {
      mnt.image = req.file.filename;
      mnt.save();
      httpStatus = HTTP_STATUS_OK;
    } else {
      //remove uploaded image
      removeImage(req.params.mntid);
    }
    res.status(httpStatus).json(toGeoFeatureObj(mnt));
  } catch (err) {
    err.statusCode = HTTP_STATUS_INETERNAL_SERVER_ERROR;
    removeImage(req.params.mntid);
    next(err);
  }
};

exports.deletePublicMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let countDeletedMnt = 0;
    const mntId = req.params.id;
    if (!isEmpty(mntId)) {
      countDeletedMnt = await Mountain.destroy({
        where: {
          userId: { [Op.is]: null },
          id: mntId,
        },
      });

      if (countDeletedMnt != 0) {
        httpStatus = HTTP_STATUS_OK;
        removeImage(mntId);
      }
    }
    res.status(httpStatus).json({ mountainsDeleted: countDeletedMnt });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUserMountain = async (req, res, next) => {
  try {
    let httpStatus = HTTP_STATUS_NOT_FOUND;
    let countDeletedMnt = 0;
    const mntId = req.params.mntid;
    if (!isEmpty(mntId)) {
      countDeletedMnt = await Mountain.destroy({
        where: {
          userId: req.params.userid,
          id: mntId,
        },
      });

      if (countDeletedMnt != 0) {
        httpStatus = HTTP_STATUS_OK;
        removeImage(mntId);
      }
    }
    res.status(httpStatus).json({ mountainsDeleted: countDeletedMnt });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUserMountains = async (req, res, next) => {
  try {
    let countDeletedMnts = 0;
    if (!isEmpty(req.params.mntids)) {
      const mntIds = req.params.mntids.toString().split(",");
      countDeletedMnts = await Mountain.destroy({
        where: {
          userId: req.params.userid,
          id: mntIds,
        },
      });

      //remove image in static directory
      for (const mntId of mntIds) {
        removeImage(mntId);
      }
    }
    res.status(200).json({ mountainsDeleted: countDeletedMnts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
