import { Router } from "express";
import replace_hereRoutes from "./replace_here.routes";

const router = Router();

router.use("/replace_here", replace_hereRoutes);

export default router;