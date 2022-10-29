export interface Message {
  albumId: string,
  phones: string[],
}

export interface DequeuedMessage {
  id: string,
  receiptHandle: string,
  message: Message,
}
