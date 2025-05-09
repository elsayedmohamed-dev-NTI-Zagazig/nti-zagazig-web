import { Request, Response, Router } from "express";
import passport from "passport";
import "./passport.service";

const googleRoute: Router = Router();

googleRoute.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
googleRoute.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const token = req.user.token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).redirect(`http://localhost:3000`);
  }
);

export default googleRoute;
