import { SQS } from 'aws-sdk';
import { DequeuedMessages, Message } from '@/dtos/message';

export class Queue {
  private readonly sqs: SQS;
  constructor(private readonly url: string) {
    this.sqs = new SQS();
    this.url = url;
  }

  async enqueueMessage(body: Message): Promise<void> {
    await this.sqs
      .sendMessage({
        QueueUrl: this.url,
        MessageBody: JSON.stringify(body),
      }).promise();
  }

  async deleteMessages(deleteMessageRequests: DequeuedMessages[]): Promise<void> {
    if (deleteMessageRequests.length <= 0) return;
    const result = await this.sqs
      .deleteMessageBatch({
        QueueUrl: this.url,
        Entries: deleteMessageRequests.map((m) => ({
          Id: m.id,
          ReceiptHandle: m.receiptHandle,
        })),
      }).promise();
    if (result.Failed.length > 0) throw new Error('Unable to delete messages from the queue');
  }
}
