import {Injectable,OnModuleInit,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.client = new Minio.Client({
      endPoint: this.config.get<string>(
        'MINIO_ENDPOINT',
        'localhost',
      ),

      port: this.config.get<number>(
        'MINIO_PORT',
        9000,
      ),

      useSSL:
        this.config.get<string>(
          'MINIO_USE_SSL',
          'false',
        ) === 'true',

      accessKey: this.config.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),

      secretKey: this.config.get<string>(
        'MINIO_SECRET_KEY',
        'minioadmin',
      ),
    });

    this.bucket = this.config.get<string>(
      'MINIO_BUCKET',
      'crm-files',
    );
  }

  async onModuleInit(): Promise<void> {
    const exists = await this.client
      .bucketExists(this.bucket)
      .catch(() => false);

    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async upload(
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const objectName = `${Date.now()}-${fileName}`;

    await this.client.putObject(
      this.bucket,
      objectName,
      buffer,
      buffer.length,
      {
        'Content-Type': mimeType,
      },
    );

    return `${this.bucket}/${objectName}`;
  }

  async remove(
    objectPath: string,
  ): Promise<void> {
    const objectName = objectPath
      .split('/')
      .slice(1)
      .join('/');

    if (!objectName) {
      throw new Error(
        `Некорректный путь MinIO: ${objectPath}`,
      );
    }

    await this.client.removeObject(
      this.bucket,
      objectName,
    );
  }

  getPresignedUrl(
    objectPath: string,
    expirySeconds = 3600,
  ): Promise<string> {
    const objectName = objectPath
      .split('/')
      .slice(1)
      .join('/');

    if (!objectName) {
      throw new Error(
        `Некорректный путь MinIO: ${objectPath}`,
      );
    }

    return this.client.presignedGetObject(
      this.bucket,
      objectName,
      expirySeconds,
    );
  }
}