import 'dotenv/config';
import { ServerApplication } from './infrastructure/consumer/server';
import { AppDataSource } from './infrastructure/database/typeorm/mongodb/data-source';

const bootstrapp = async () => {
  try {
    await AppDataSource.initialize();
    await new ServerApplication().start();
  } catch (error: unknown) {
    console.log(error);
  }
}

bootstrapp();