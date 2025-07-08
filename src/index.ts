import { Router } from "express";
import v1Routes from "../src/api/v1/";
const appRoutes: Router = Router();
appRoutes.use("/v1", v1Routes);

export default appRoutes;
