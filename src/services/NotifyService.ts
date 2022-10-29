import { DataSource } from 'typeorm';
import { Otp } from '@/utils/Otp';
import { Album } from '@/entities/Album';
import { Message } from '@/dtos/message';

export class NotifyService {
  constructor(private readonly ds: DataSource, private readonly otp: Otp) {
    this.ds = ds;
    this.otp = otp;
  }

  public notificatePhotosUploaded = async (message: Message) => {
    if (!this.ds.manager.connection.isInitialized) await this.ds.initialize();

    const album = await this.ds.getRepository(Album).findOneBy({ id: message.albumId });
    if (!album) throw new Error('Unknown album');

    const promises = message.phones.map(async (phone) => {
      try {
        const res = await this.otp.sendSms(
          phone,
          `Find new photos at "${album.title}" album!`,
        );
        console.log(`${phone} sms status: ${res.status}`);
      } catch (error) {
        console.log(`${phone} sms status: failed`);
      }
    });
    await Promise.all(promises);
  };
}
