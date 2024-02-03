import { QueueServiceInterface } from "../@shared/queue.service.interface";
import { QUEUE_CONFIG } from "./config";
import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { AppDataSource } from "../../database/typeorm/mongodb/data-source";
import { ProductModel } from "../../database/typeorm/mongodb/entities/product.mongo.entity";
import StoreCatalog from "../../../use-case/store-catalog";
import S3Service from "../../storage/aws/s3.service";
import GetProduct from "../../../use-case/get-product";

export class SnsQueueService implements QueueServiceInterface {
  private sqsClient: SQSClient;

  setup(): void {
    this.sqsClient = new SQSClient({
      region: QUEUE_CONFIG.awsRegion,
      credentials: {
        accessKeyId: QUEUE_CONFIG.accessKeyId,
        secretAccessKey: QUEUE_CONFIG.secretAccessKey,
      },
    });
  }

  async listen(queueUrl: string): Promise<void> {
    const app = Consumer.create({
      queueUrl: queueUrl,
      handleMessage: async (message) => {
        const messageBody = message.Body ?? "";
        const messageType = JSON.parse(messageBody).Message;
        const messageAttributes = JSON.parse(messageBody).MessageAttributes;
        const ownerId = messageAttributes.ownerId.Value;
        const product = await new GetProduct(
          AppDataSource.getRepository(ProductModel)
        ).execute(ownerId);
        await new StoreCatalog(new S3Service()).execute(product);
      },

      sqs: this.sqsClient,
    });

    app.on("error", (err) => {
      console.error(err.message);
    });

    app.on("processing_error", (err) => {
      console.error(err.message);
    });

    app.start();
  }
}
