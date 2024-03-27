import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
 nest g module user --createUserModule
 nest g controller user --no-spec   --createUserController
 nest g service user --no-spec  --createUserSreice
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1'); //添加接口前缀
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
