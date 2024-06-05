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
  generateNewKey,
  addUserToDoc,
  addAdminToDoc,
} from "../controllers/operationController";
import { checkRBTreeInCache } from "../middleware/checkRBTree";
import { userSession } from "../middleware/session";
import { checkDocAccess } from "../middleware/documentAccess";

const router = express.Router();

router.route("/").get(userSession, index);
router.route("/new").post(userSession, createDocument);
router
  .route("/createRBTree/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, createRBTree);
router
  .route("/generateKey/:docId")
  .post(userSession, checkRBTreeInCache, generateNewKey);
router
  .route("/insert/:docId")
  .post(userSession, checkDocAccess, checkRBTreeInCache, insertAt);
router
  .route("/preOrder/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, preOrderDocument);
router
  .route("/inOrder/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, inOrderDocument);
router
  .route("/postOrder/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, postOrderDocument);
router
  .route("/levelOrder/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, levelOrderTraversal);
router
  .route("/height/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, getHeightOfTree);
router
  .route("/blackNodesValidation/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, blackNodesValidation);
router
  .route("/print/:docId")
  .get(userSession, checkDocAccess, checkRBTreeInCache, printTree);
router
  .route("/delete/:docId")
  .delete(userSession, checkDocAccess, checkRBTreeInCache, removeCharacter);
router.route("/:docId/addUser").post(userSession, checkDocAccess, addUserToDoc);
router
  .route("/:docId/addAdmin")
  .post(userSession, checkDocAccess, addAdminToDoc);

export default router;
