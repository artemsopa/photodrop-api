import { SQSEvent } from 'aws-lambda';
import { Queue } from '@/utils/Queue';
import { NotifyService } from '@/services/NotifyService';
import { DequeuedMessages, Message } from '@/dtos/message';

export class NotifyHandler {
  constructor(private readonly service: NotifyService, private readonly queue: Queue) {
    this.queue = queue;
  }

  public notify = async (event: SQSEvent) => {
    const dequeued = this.mapEventToDequeued(event);
    const toDelete: DequeuedMessages[] = [];

    const promises = dequeued.map(async (body) => {
      try {
        await this.service.notificatePhotosUploaded(body.message);
        toDelete.push(body);
      } catch (error) {
        toDelete.push(body);
      }
    });
    await Promise.all(promises);

    const numRetriableMessages = dequeued.length - toDelete.length;
    if (numRetriableMessages > 0) {
      await this.queue.deleteMessages(toDelete);
      const errorMessage = `Failing due to ${numRetriableMessages} unsuccessful and retriable errors`;
      throw new Error(errorMessage);
    }
  };

  private mapEventToDequeued = (event: SQSEvent) => event.Records.map((record) => {
    const message: Message = JSON.parse(record.body);
    return {
      id: record.messageId,
      receiptHandle: record.receiptHandle,
      message,
    };
  });
}
