import serverless from 'serverless-http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';


let server: any;

export default async function handler(req: any, res: any) {
  if (!server) {
    const app = await NestFactory.create(AppModule, { logger: false });

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    server = serverless(expressApp);
  }

  return server(req, res);
}
