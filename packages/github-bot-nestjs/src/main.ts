import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  
  const server = app.getHttpServer();
  const serverAddress = server.address();
  
  if (typeof serverAddress === 'string') {
    console.log(`Probot Server started at ${serverAddress}`);
  } else if (serverAddress && typeof serverAddress === 'object') {
    const host = serverAddress.address === '0.0.0.0' ? 'localhost' : serverAddress.address;
    console.log(`Probot Server started at http://${host}:${serverAddress.port}`);
  } else {
    console.log(`Probot Server started on port ${port}`);
  }
}
bootstrap();
