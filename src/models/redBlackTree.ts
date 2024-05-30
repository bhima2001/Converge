import { TreeNode } from "./treeNode";
import { IDocument } from '../Schemas/documentSchema';
import { ICharacter } from '../Schemas/characterSchema';
import { compareKeys } from '../helper/operationHelper';

export class RedBlackTree {
  root: TreeNode | null = null
  size: number = 0

  public createRedBlackTree(document: IDocument): boolean {
    const content: ICharacter[] = document.content
    for( let i=0; i<content.length; i++){
      this.insertElement(content[i].key, content[i].letter)
      this.printTree()
      console.log("")
      console.log("")
      console.log("")
    }
    return true
  }

  public insertElement(key: number[], value: string): void{
    const newNode = new TreeNode(key, value)
    console.log(newNode)
    if(this.root === null){
      newNode.isBlack = true
      this.root = newNode
      this.size++
      this.checkColorViolations(newNode)
      return;
    }
    this.findAndInsert(this.root, newNode)
    this.size++
    console.log(newNode)
    this.checkColorViolations(newNode)
    if (this.root !== null) {
      this.root.isBlack = true;
    }
    return
  }

  public getInOrderTraversal(currentNode: TreeNode | null): string[] {
    const res: string[] = []
    this.inOrderTraversal(currentNode, res)
    return res;
  }

  public getPostOrderTraversal(currentNode: TreeNode | null): string[] {
    const res: string[] = []
    this.postOrderTraversal(currentNode, res)
    return res;
  }

  public getPreOrderTraversal(currentNode: TreeNode | null): string[] {
    const res: string[] = []
    this.preOrderTraversal(currentNode, res)
    return res;
  }

  public getLevelOrderTraversal(currentNode: TreeNode | null): string[] {
    const res: string[] = []
    if(!currentNode) return res;
    const queue: TreeNode[] = []
    queue.push(currentNode)

    while(queue.length){
      const temp: TreeNode = queue.shift()!
      res.push(temp.value)

      if(temp.left)queue.push(temp.left);
      if(temp.right)queue.push(temp.right);
    }
    return res;
  }

  public checkColorViolations(node: TreeNode) {
    if(node.parent === null)return;

    if(node.isBlack === false && node.parent.isBlack === false){
      this.resolveViolation(node);
    }
    if(node.parent)this.checkColorViolations(node.parent)
  }

  public heightOfTree(): number {
    if (this.root === null)return 0;
    return this.longestPath(this.root) - 1
  }
  
  public blackNodesValidation(): boolean {
    if(this.root === null)return true;
    const left: number = this.noOfBlackNodes(this.root.left)
    const right: number = this.noOfBlackNodes(this.root.right)

    return left === right
  }

  public printTree() {
    if (this.root === null) return;

    const height = this.heightOfTree() + 1;
    const maxWidth = Math.pow(2, height);
    const output = Array(height).fill(null).map(() => Array(maxWidth).fill(" "));

    const fill = (node: TreeNode, level: number, pos: number) => {
        if (node === null || pos < 0) return;

        output[level][pos] = node.value.concat(node.isBlack ? 'B' : 'R')
        const gap = Math.pow(2, height - level - 2);

        if (node.left) {
            fill(node.left, level + 1, pos - gap);
        }
        if (node.right) {
            fill(node.right, level + 1, pos + gap);
        }
    };

    fill(this.root, 0, Math.floor(maxWidth / 2));
    output.forEach(line => console.log(line.join("")));
  }

  public serializeTree(): string {
    return JSON.stringify(this.serializeNode(this.root))
  }

  public deSerializeTree(data: string | null) {
    if(data){
      this.root = this.deserializeNode(JSON.parse(data))
    }
  }

  private deserializeNode(data: TreeNode | null, parent: TreeNode | null = null): TreeNode | null {
    if (data === null) {
      return null;
    }
    this.size++;
    const node = new TreeNode(data.key, data.value);
    node.isBlack = data.isBlack
    node.isLeftChild = data.isLeftChild
    node.left = this.deserializeNode(data.left, node);
    node.right = this.deserializeNode(data.right, node);
    node.parent = parent;
    return node;
  }

  private longestPath(node: TreeNode | null): number {
    if(node === null) return 0;

    let left: number  = 1 + this.longestPath(node.left);
    let right: number = 1 + this.longestPath(node.right);

    return Math.max(left, right)
  }

  private findAndInsert(currNode: TreeNode, newNode: TreeNode): void{
    const comparatorValue = compareKeys(currNode.key, newNode.key);

    if(comparatorValue >= 0) {
      if(currNode.left == null) {
        currNode.left = newNode
        newNode.parent = currNode
        newNode.isBlack = false
        newNode.isLeftChild = true
        return;
      }
      return this.findAndInsert(currNode.left, newNode)
    }
    if(currNode.right == null) {
      currNode.right = newNode
      newNode.parent = currNode
      newNode.isBlack = false
      newNode.isLeftChild = false
      return;
    }
    return this.findAndInsert(currNode.right, newNode)
  }

  private preOrderTraversal(currentNode: TreeNode | null, res: string[]) {
    if(currentNode == null)return;

    res.push(currentNode.value)
    this.preOrderTraversal(currentNode.left, res);
    this.preOrderTraversal(currentNode.right, res);
  }

  private inOrderTraversal(currentNode: TreeNode | null, res: string[]): void{
    if(currentNode == null)return;

    this.inOrderTraversal(currentNode.left, res);
    res.push(currentNode.value)
    this.inOrderTraversal(currentNode.right, res);
  }

  private postOrderTraversal(currentNode: TreeNode | null, res: string[]) {
    if(currentNode == null)return;

    this.postOrderTraversal(currentNode.left, res);
    this.postOrderTraversal(currentNode.right, res);
    res.push(currentNode.value)
  }


  private resolveViolation(node: TreeNode) {
  
    if(node.parent?.isLeftChild){
      if(!node.parent.parent?.right || node.parent!.parent!.right.isBlack){
        return this.rotation(node)
      }
      if(node.parent.parent.right != null)node.parent.parent.right.isBlack = true
      node.parent.parent.isBlack = false
      node.parent.isBlack = true
      return;
    }
    if(!node.parent?.parent?.left || node.parent?.parent?.left.isBlack){
      return this.rotation(node)
    }
    if(node.parent.parent.left != null)node.parent.parent.left.isBlack = true
    node.parent.parent.isBlack = false
    node.parent.isBlack = true
    return;
  }

  private rotation(node: TreeNode) {
    if(node.isLeftChild){
      if(node.parent?.isLeftChild){
        if(node.parent.parent)this.rightRotate(node.parent.parent)
        node.parent.isBlack = true
        node.isBlack = false
        if(node.parent.right)node.parent.right.isBlack = false
        return;
      }
      if(node.parent?.parent) this.rightLeftRotate(node.parent?.parent)
      node.isBlack = true
      if(node.left)node.left.isBlack = false
      if(node.right)node.right.isBlack = false
      return;
    }
    if(node.parent?.isLeftChild){
      if(node.parent.parent) this.leftRightRotate(node.parent.parent)
      node.isBlack = true
      if(node.left)node.left.isBlack = false
      if(node.right)node.right.isBlack = false
      return;
    }
    if(node.parent?.parent)this.leftRotate(node.parent.parent)
    node.isBlack = false
    node.parent!.isBlack = true
    if(node.parent?.left)node.parent.left.isBlack = false
  }

  private rightRotate(node: TreeNode) {
    const temp: TreeNode | null = node.left
    node.left = temp!.right
    if(node.left !== null){
      node.left.isLeftChild = true
      node.left.parent = node
    }
    if(node.parent === null){
      this.root = temp
      temp!.parent = null
      temp!.isBlack = true
    }else {
      temp!.parent = node.parent
      if(node.isLeftChild){
        temp!.isLeftChild = true
        temp!.parent.left = temp
      }else {
        temp!.isLeftChild = false
        temp!.parent.right = temp
      }
    }
    temp!.right = node
    node.isLeftChild = false
    node.parent = temp
  }

  private leftRotate(node: TreeNode) {
    const temp: TreeNode | null = node.right
    node.right = temp!.left
    if(node.right !== null) {
      node.right.parent = node
      node.right.isLeftChild = false
    }
    if(node.parent === null) {
      this.root= temp
      temp!.parent = null
      temp!.isBlack = true
    }else {
      temp!.parent = node.parent
      if(node.isLeftChild) {
        temp!.isLeftChild = true
        temp!.parent.left = temp
      }else{
        temp!.isLeftChild = false
        temp!.parent.right = temp
      }
    }
    temp!.left = node
    node.isLeftChild = true
    node.parent = temp
  }

  private leftRightRotate(node: TreeNode) {
    if(node.left) this.leftRotate(node.left)
    this.rightRotate(node)
  }

  private rightLeftRotate(node: TreeNode) {
    if(node.right) this.rightRotate(node.right)
    this.leftRotate(node)
  }

  private noOfBlackNodes(node: TreeNode | null): number {
    if(node === null)return 0;

    if(node.isBlack)return 1 + this.noOfBlackNodes(node.left) + this.noOfBlackNodes(node.right);
    return this.noOfBlackNodes(node.left) + this.noOfBlackNodes(node.right)
  }

  public deletedAt(key: number[]): void {
    const nodeToDelete = this.findNode(this.root!, key);
    if (nodeToDelete !== null) {
      this.deleteRecursively(nodeToDelete);
      if (this.root !== null) {
        this.root.isBlack = true;
      }
      this.size--;
    }
  }

  private findNode(node: TreeNode, key: number[]): TreeNode | null {
    const comparatorValue = compareKeys(node.key, key)

    if(comparatorValue == 0)return node;

    if(comparatorValue > 0){
      if(node.left)return this.findNode(node.left, key)
      return null
    }
    if(node.right)return this.findNode(node.right, key)
    return null
  }

  private deleteRecursively(node: TreeNode): void {
    let y = node;
    let yOriginalColor = y.isBlack;
    let x: TreeNode | null;

    if (node.left === null) {
      x = node.right;
      this.transplant(node, node.right);
    } else if (node.right === null) {
      x = node.left;
      this.transplant(node, node.left);
    } else {
      y = this.getSuccessor(node.right);
      yOriginalColor = y.isBlack;
      x = y.right;
      if (y.parent === node) {
        if (x !== null) x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = node.right;
        if (y.right !== null) y.right.parent = y;
      }
      this.transplant(node, y);
      y.left = node.left;
      if (y.left !== null) y.left.parent = y;
      y.isBlack = node.isBlack;
    }

    if (yOriginalColor) {
      this.fixDeletion(x, y.parent);
    }
  }

  private transplant(u: TreeNode, v: TreeNode | null): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v !== null) {
      v.parent = u.parent;
    }
  }

  private getSuccessor(node: TreeNode): TreeNode {
    while(node.left) {
      node = node.left;
    }
    return node
  }

  private fixDeletion(node: TreeNode | null, parent: TreeNode | null): void {
    if (node === this.root) return;

    if (node === parent?.left) {
      let sibling = parent.right;
      if (sibling !== null && !sibling.isBlack) {
        sibling.isBlack = true;
        parent.isBlack = false;
        this.leftRotate(parent);
        sibling = parent.right;
      }
      if ((sibling!.left === null || sibling!.left.isBlack) && (sibling?.right === null || sibling!.right.isBlack)) {
        if (sibling !== null) sibling.isBlack = false;
        this.fixDeletion(parent, parent.parent);
      } else {
        if (sibling?.right === null || sibling!.right.isBlack) {
          if (sibling?.left !== null) sibling!.left.isBlack = true;
          if (sibling !== null) sibling.isBlack = false;
          this.rightRotate(sibling!);
          sibling = parent.right;
        }
        if (sibling !== null) sibling.isBlack = parent.isBlack;
        if (parent !== null) parent.isBlack = true;
        if (sibling?.right !== null) sibling!.right.isBlack = true;
        this.leftRotate(parent);
        node = this.root;
      }
    } else {
      let sibling = parent?.left;
      if (sibling !== null && !sibling!.isBlack) {
        sibling!.isBlack = true;
        parent!.isBlack = false;
        this.rightRotate(parent!);
        sibling = parent!.left;
      }
      if ((sibling?.right === null || sibling!.right.isBlack) && (sibling?.left === null || sibling!.left.isBlack)) {
        if (sibling !== null) sibling!.isBlack = false;
        this.fixDeletion(parent, parent!.parent);
      } else {
        if (sibling?.left === null || sibling!.left.isBlack) {
          if (sibling?.right !== null) sibling!.right.isBlack = true;
          if (sibling !== null) sibling!.isBlack = false;
          this.leftRotate(sibling!);
          sibling = parent!.left;
        }
        if (sibling !== null) sibling!.isBlack = parent!.isBlack;
        if (parent !== null) parent.isBlack = true;
        if (sibling?.left !== null) sibling!.left.isBlack = true;
        this.rightRotate(parent!);
        node = this.root;
      }
    }

    if (node !== null) node.isBlack = true;
  }

  private serializeNode(node: TreeNode | null): any{
    if(node === null) return null;
    return {
        key: node.key,
        value: node.value,
        left: this.serializeNode(node.left),
        right: this.serializeNode(node.right),
        isBlack: node.isBlack,
        isLeftChild: node.isLeftChild,
        parentKey: node.parent ? node.parent.key : null
    }
  }
}
