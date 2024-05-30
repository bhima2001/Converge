export class TreeNode {
  key: number[] = []
  value: string
  parent: TreeNode | null = null
  left: TreeNode | null = null
  right: TreeNode | null = null
  isLeftChild: boolean = true
  isBlack: boolean = false

  constructor(key: number[], value: string) {
    this.value = value
    this.key = key
  }
}