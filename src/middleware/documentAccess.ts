import { Documents, IDocument } from "../Schemas/documentSchema";
import { nextFunctionType, requestType, responseType } from "../types";

export const checkDocAccess = async (
  req: requestType,
  res: responseType,
  next: nextFunctionType
) => {
  const { docId } = req.params;
  const docInstance: IDocument | null = await Documents.findById(
    docId
  ).populate("content");
  if (!docInstance) {
    res.send({
      status: 404,
      message: `Document with ID ${docId} not found.`,
    });
    return;
  }
  req.document = docInstance;

  const canAccess = docInstance.public || docInstance.checkUserAccess(req.user);
  console.log(canAccess);
  if (!canAccess) {
    res.send({
      status: 403,
      message: "You do not have permission to access this document.",
    });
    return;
  }
  next();
};
