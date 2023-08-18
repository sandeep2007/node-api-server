const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { getUserById } = require("../models/userModel");
const {
  findRefreshToken,
  deleteRefreshToken,
} = require("../models/tokenModel");
const Logger = require("../utils/Logger");
const { sendError } = require("./errorMiddleware");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getUserById(decoded.id);

        if (user) {
          req.user = user;
          next();
        } else {
          Logger.info(`user not found`);
          sendError(res, 401, new Error(`Not authorized, token expired`));
          // throw new Error(`Not authorized, token expired`)
        }
      } catch (error) {
        Logger.info(`Token expired`);
        sendError(res, 401, new Error(`Not authorized, token expired`));
        // throw new Error(`Not authorized, token expired`)
      }
    } catch (error) {
      Logger.error(error);
      sendError(res, 401, error);
      // throw new Error(`Not authorized, token failed`)
    }
  }

  if (!token) {
    Logger.info(`no token`);
    sendError(res, 401, new Error(`Not authorized, no token`));
    // throw new Error(`Not authorized, no token`)
  }
});

const refresh = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      validateToken = await findRefreshToken(token);

      if (validateToken) {
        await deleteRefreshToken(token);
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
          Logger.info(error.message);
          sendError(res, 403, new Error(`Not authorized, Token expired`));
        }
        res.send({
          tokens: {
            accessToken: generateToken(decoded.id),
            refreshToken: await generateRefreshToken(decoded.id),
          },
        });
      } else {
        Logger.info(`token deleted`);
        sendError(res, 403, new Error(`token deleted`));
      }
    } catch (error) {
      Logger.error(error);
      sendError(res, 403, new Error(`Not authorized, ${error.message}`));
    }
  }

  if (!token) {
    Logger.info(`refresh token required`);
    sendError(res, 403, new Error(`Not authorized, refresh token required`));
  }
});

module.exports = { protect, refresh };
