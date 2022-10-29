export interface Message {
  albumId: string,
  phones: string[],
}

export interface DequeuedMessages {
  id: string,
  receiptHandle: string,
  message: Message,
}
