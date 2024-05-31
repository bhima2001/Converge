import express from "express";
import {
  index,
  createDocument,
  createRBTree,
  insertAt,
  inOrderDocument,
  postOrderDocument,
  levelOrderTraversal,
  preOrderDocument,
  getHeightOfTree,
  blackNodesValidation,
  printTree,
  removeCharacter,
} from "../controllers/operationController";
import { checkRBTreeInCache } from "../middleware/checkRBTree";
import { userSession } from "../middleware/session";

const router = express.Router();

router.route("/").get(userSession, index);
router.route("/new").post(userSession, createDocument);
router
  .route("/createRBTree/:docId")
  .get(userSession, checkRBTreeInCache, createRBTree);
router.route("/insert/:docId").post(userSession, checkRBTreeInCache, insertAt);
router
  .route("/preOrder/:docId")
  .get(userSession, checkRBTreeInCache, preOrderDocument);
router
  .route("/inOrder/:docId")
  .get(userSession, checkRBTreeInCache, inOrderDocument);
router
  .route("/postOrder/:docId")
  .get(userSession, checkRBTreeInCache, postOrderDocument);
router
  .route("/levelOrder/:docId")
  .get(userSession, checkRBTreeInCache, levelOrderTraversal);
router
  .route("/height/:docId")
  .get(userSession, checkRBTreeInCache, getHeightOfTree);
router
  .route("/blackNodesValidation/:docId")
  .get(userSession, checkRBTreeInCache, blackNodesValidation);
router.route("/print/:docId").get(userSession, checkRBTreeInCache, printTree);
router
  .route("/delete/:docId")
  .delete(userSession, checkRBTreeInCache, removeCharacter);

export default router;
