import { SQSEvent } from 'aws-lambda';
import { Queue } from '@/utils/Queue';
import { NotifyService } from '@/services/NotifyService';
import { DequeuedMessage, Message } from '@/dtos/message';

export class NotifyHandler {
  constructor(private readonly service: NotifyService, private readonly queue: Queue) {
    this.queue = queue;
  }

  public notify = async (event: SQSEvent) => {
    const dequeuedMessages = this.mapEventToDequeuedMessages(event);
    const messagesToDelete: DequeuedMessage[] = [];

    const promises = dequeuedMessages.map(async (body) => {
      try {
        await this.service.notificatePhotosUploaded(body.message);
        messagesToDelete.push(body);
      } catch (error) {
        messagesToDelete.push(body);
      }
    });
    await Promise.all(promises);

    const numRetriableMessages = dequeuedMessages.length - messagesToDelete.length;
    if (numRetriableMessages > 0) {
      await this.queue.deleteMessages(messagesToDelete);
      const errorMessage = `Failing due to ${numRetriableMessages} unsuccessful and retriable errors.`;
      throw new Error(errorMessage);
    }
  };

  private mapEventToDequeuedMessages = (event: SQSEvent) => event.Records.map((record) => {
    const message: Message = JSON.parse(record.body);
    return {
      id: record.messageId,
      receiptHandle: record.receiptHandle,
      message,
    };
  });
}
