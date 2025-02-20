export interface Spin {
  _id: string
  number: number
  user: string
  sessionId: string
  metadata: {
    dozen: 'first' | 'second' | 'third'
    isZeroNeighbor: boolean
    color: 'red' | 'black' | 'green'
    isEven: boolean
  }
  createdAt: string
  updatedAt: string
}
