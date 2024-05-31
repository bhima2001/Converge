import type { requestType, responseType } from "../types.d.ts";
import { Documents, IDocument } from "../Schemas/documentSchema";
import { Character, ICharacter } from "../Schemas/characterSchema";
import { RedBlackTree } from "../models/redBlackTree";
import { client } from "../redis-setup";
import { generateKey } from "../helper/operationHelper";

export const index = (req: requestType, res: responseType) => {
  console.log("This is the index page of the application.");
};

export const createDocument = async (req: requestType, res: responseType) => {
  try {
    const newDocument = await Documents.create({});
    res.send({
      state: 200,
      data: newDocument,
    });
  } catch (error) {
    console.log("error: ", error);
    res.send({ error });
  }
};

export const createRBTree = async (req: requestType, res: responseType) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const inOrder = rbTree.getInOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: "Red Black Tree is successfully created. This is the Inorder Traversal: ",
    inOrder,
  });
};

export const insertAt = async (req: requestType, res: responseType) => {
  const { siteId, leftDigitList, rightDigitList, value } = req.query;
  const { docId } = req.params;
  if (
    typeof siteId !== "string" ||
    typeof leftDigitList !== "string" ||
    typeof rightDigitList !== "string" ||
    typeof value !== "string"
  ) {
    res.status(400).send("Invalid query parameter");
    return;
  }
  const parsedLeftDigitList = leftDigitList ? JSON.parse(leftDigitList) : [];
  const parsedRightDigitList = rightDigitList ? JSON.parse(rightDigitList) : [];
  const key: number[] = generateKey(
    parsedLeftDigitList,
    parsedRightDigitList,
    Number(siteId)
  );
  const docInstance: IDocument | null = await Documents.findOne({ _id: docId })
    .populate("content")
    .exec();
  const newCharacter: ICharacter = await Character.create({
    key: key,
    letter: value,
  });

  if (!docInstance) {
    res.send({
      status: 404,
      message: `Document not found with id = ${docId}`,
    });
    return;
  }

  docInstance.content.push(newCharacter._id);
  await docInstance.save();

  let serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  rbTree.insertElement(key, value as string);

  serializedTreeData = rbTree.serializeTree();
  await client.set(docId, serializedTreeData);

  const inOrder: string[] = rbTree.getInOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: `This is the red black tree ${rbTree.root}, the size of the tree currently is  ${rbTree.size} and the inorder traversal of the current tree is ${inOrder}`,
  });
};

export const preOrderDocument = async (req: requestType, res: responseType) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const preOrder = rbTree.getPreOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: `Here is the preOrder Traversal: ${preOrder}`,
  });
};

export const inOrderDocument = async (req: requestType, res: responseType) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const inOrder = rbTree.getInOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: `Here is the inOrder Traversal: ${inOrder}`,
  });
};

export const postOrderDocument = async (
  req: requestType,
  res: responseType
) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const postOrder: string[] = rbTree.getPostOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: `Here is the postOrder Traversal: ${postOrder}`,
  });
};

export const levelOrderTraversal = async (
  req: requestType,
  res: responseType
) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const levelOrder: string[] = rbTree.getLevelOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    data: `Here is the levelOrder Traversal: ${levelOrder}`,
  });
};

export const getHeightOfTree = async (req: requestType, res: responseType) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  const height: number = rbTree.heightOfTree();
  res.send({
    status: 200,
    data: `The current height of the tree is ${height}`,
  });
};

export const blackNodesValidation = async (
  req: requestType,
  res: responseType
) => {
  const { docId } = req.params;
  const docInstance: IDocument | null = await Documents.findById(docId)
    .populate("content")
    .exec();
  if (!docInstance) {
    res.send({
      status: 404,
      message: `Document with ID ${docId} not found.`,
    });
    return;
  }
  const rbTree = new RedBlackTree();
  rbTree.createRedBlackTree(docInstance);
  const flag: boolean = rbTree.blackNodesValidation();
  res.send({
    status: 200,
    message: `This is ${flag ? `not` : ``} a valid red black tree`,
  });
};

export const printTree = async (req: requestType, res: responseType) => {
  const { docId } = req.params;
  const serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);
  rbTree.printTree();
  res.send({
    status: 200,
    message: "successfully printed the tree check console",
  });
};

export const removeCharacter = async (req: requestType, res: responseType) => {
  const { siteId, digitList, value } = req.query;
  const { docId } = req.params;
  if (
    typeof value !== "string" ||
    typeof digitList !== "string" ||
    typeof siteId !== "string"
  ) {
    res.status(400).send("Invalid query parameter");
    return;
  }
  const key = JSON.parse(digitList);
  if (!siteId && !digitList && !value) {
    res.send({
      status: 400,
      message: "siteId, positionId or value any of these values are missing",
    });
    return;
  }
  const docInstance: IDocument | null = await Documents.findById(docId)
    .populate("content")
    .exec();
  if (!docInstance) {
    res.send({
      status: 404,
      message: `Document with ID ${docId} not found.`,
    });
    return;
  }
  docInstance.content = docInstance.content.filter(
    (character: ICharacter): boolean => character.key === key
  );
  await docInstance.save();

  let serializedTreeData = await client.get(docId);
  console.log("This is serialized Tree data: ", serializedTreeData);
  const rbTree = new RedBlackTree();
  rbTree.deSerializeTree(serializedTreeData);

  rbTree.deletedAt(key);
  serializedTreeData = rbTree.serializeTree();
  await client.set(docId, serializedTreeData);

  rbTree.printTree();
  const inOrder = rbTree.getInOrderTraversal(rbTree.root);
  res.send({
    status: 200,
    message: `Removed the character please check the console for the latest tree. Inorder after removal: ${inOrder}`,
  });
};
