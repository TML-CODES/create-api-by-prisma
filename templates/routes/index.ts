import { Router } from "express";
import { {name} } from "./{name}.routes";

const router = Router();

router.use("/{name}", {name});

export default router;