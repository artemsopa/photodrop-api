import { S3Event, SQSEvent } from 'aws-lambda';
import { EventService } from '@/services/EventService';
import { Queue } from '@/utils/Queue';
import { DequeuedMessage, Message } from '@/dtos/message';

export class EventHandler {
  constructor(private readonly service: EventService, private readonly queue: Queue) {
    this.service = service;
    this.queue = queue;
  }

  public resize = async (event: S3Event) => {
    const promises = event.Records.map(async (record) => {
      try {
        await this.service.resize(record);
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(promises);
  };

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
