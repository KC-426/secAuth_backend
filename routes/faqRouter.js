import express from "express";

import {
  addFaq,
  editFaq,
  getAllFaqs,
  getFaqById,
  removeFaqById,
} from "../controller/faqController.js";

const router = express.Router();

router.route("/add/new/faq").post(addFaq);
router.route("/edit/faq/:faqId").put(editFaq);
router.route("/fetch/all/faq").get(getAllFaqs);
router.route("/get/faq/:faqId").get(getFaqById);
router.route("/delete/faq/:faqId").delete(removeFaqById);

export default router;
