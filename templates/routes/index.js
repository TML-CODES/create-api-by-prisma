const { Router } = require("express");
const { {name} } = require("./{name}.routes");

const router = Router();

router.use("/{name}", {name});

export default router;