import { Router } from "express";
import muler from "multer"
const router: Router = Router()

import * as controller from "../../controller/admin/upload.controller"

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middlewares";

const upload = muler()

router.post(
    "/",
    upload.single("file"),
    uploadCloud.uploadSingle,
    controller.index
)

export const uploadRoutes: Router = router