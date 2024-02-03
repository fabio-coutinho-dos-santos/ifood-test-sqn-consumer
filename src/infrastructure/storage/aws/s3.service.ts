import { StorageServiceInterface } from "../@shared/storage.service.interface";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromUtf8 } from "@aws-sdk/util-utf8-node";
import { STORAGE_CONFIG } from "../config";

export default class S3Service implements StorageServiceInterface {
  private s3Client: S3Client;

  constructor() {
    this.setup();
  }

  setup() {
    this.s3Client = new S3Client({
      region: STORAGE_CONFIG.awsRegion,
      credentials: {
        accessKeyId: STORAGE_CONFIG.accessKeyId,
        secretAccessKey: STORAGE_CONFIG.secretAccessKey,
      },
    });
  }

  async uploadFile(catalog: any): Promise<any> {
    try {
      const path = `catalogs/ifood/owner-${catalog.owner}.json`;

      const payload = {
        Bucket: STORAGE_CONFIG.bucket,
        Key: path,
        Body: fromUtf8(JSON.stringify(catalog)),
        ContentType: "application/json",
      };

      const command = new PutObjectCommand(payload);

      const data = await this.s3Client.send(command);

      return {
        message: "File uploaded successfully",
        data: {
          fileUrl: path,
        },
      };
    } catch (error: unknown) {
      console.log(String(error));
    }
  }
}
