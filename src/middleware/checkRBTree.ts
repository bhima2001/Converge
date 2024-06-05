import { client } from "../redis-setup";
import { requestType, responseType, nextFunctionType } from "../types";
import { Documents, IDocument } from "../Schemas/documentSchema";
import { RedBlackTree } from "../models/redBlackTree";

export const checkRBTreeInCache = async (
  req: requestType,
  res: responseType,
  next: nextFunctionType
) => {
  try {
    const { docId } = req.params;
    const isCachedInRedis = await client.get(docId);
    console.log(typeof isCachedInRedis, isCachedInRedis === "null");
    console.log("This is docId:", docId);
    if (isCachedInRedis === "null") {
      const docInstance: IDocument | null = await Documents.findById(
        docId
      ).populate("content");
      if (docInstance === null) {
        res.send({
          status: 404,
          message: `Document not found with id = ${docId}`,
        });
        next();
        return;
      }
      const rbTree = new RedBlackTree();
      rbTree.createRedBlackTree(docInstance);
      const treeData = rbTree.serializeTree();
      await client.set(docId, treeData);
    }
    next();
  } catch (error) {
    console.log(error);
    throw new Error("error in Redis Middleware");
  }
};
