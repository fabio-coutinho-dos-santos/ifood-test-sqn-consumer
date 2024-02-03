import { Server } from "@overnightjs/core";
import * as bodyParser from "body-parser";
import { QueueServiceInterface } from "../queue/@shared/queue.service.interface";
import { SnsQueueService } from "../queue/aws/sns-queue.service";
import { QUEUE_CONFIG } from "../queue/aws/config";

export class ServerApplication extends Server {
  private queueService: QueueServiceInterface;

  constructor() {
    super();
    this.queueService = new SnsQueueService();
    this.queueService.setup();
  }

  async start() {
    await this.queueService.listen(QUEUE_CONFIG.sqsQueue);
    console.log("Listen Queue");
  }
}
