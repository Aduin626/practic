import jwt from "jsonwebtoken";

function jwtTokens({ email, userid, roleid }) {
  const user = { email, userid, roleid };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3h",
  });
  return accessToken;
}

export { jwtTokens };

