const { Router } = require("express");
const { replace_here } = require("./replace_here.routes");

const router = Router();

router.use("/replace_here", replace_hereRoutes);

export default router;