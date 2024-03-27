

# 一文带你搞定Nestjs项目中的配置文件(四种方案)！

（妈妈再也不用担心我的学习了！认准汪枫，用最详细的步骤和保姆式教学为你答疑解惑）

### 前言：

应用程序通常在不同的**环境**中运行，根据环境的不同，应该使用不同的配置设置。例如，通常本地环境依赖于特定的数据库凭据，仅对本地 DB 实例有效，生产环境将使用一组单独的 DB 凭据。

由于配置变量会更改，所以最佳实践是将配置变量存储在环境中。

应用程序通常在不同的**环境**中运行，根据环境（Development，Production）的不同，应该使用不同的配置设置。

### 第一章:smile:

### 1.最简单的用法

使用官方为我们提供的nestconfig配置库 去解析我们的配置文件

#### 1.1安装依赖

```bash
npm i --save @nestjs/config
```

#### 1.2创建配置文件(.env)

```bash
DATABASE_USER=test
DATABASE_PASSWORD=test123
```

#### 1.3配置`src/app.module.ts`：

```tsx
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HomeworkModule } from './homework/homework.module';
import { ConfigModule } from '@nestjs/config';// 全局导入配置模块
@Module({
  // 导入配置模块
  imports: [
    ConfigModule.forRoot({
      // 设置为全局配置 再每个模块中都可以使用
      isGlobal: true,
    }),
    UserModule,
    HomeworkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

下面来使用`src/app.controller.ts`中测试：

```typescript
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
     //别忘了初始化方法
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    console.log(dbUser); // 这里来测试
    return this.appService.getHello();
  }
}
```

尝试在`src/user.controller.ts`中使用：

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get()
  getUsers(): any {
    const DATABASE_USER = this.configService.get<string>('DATABASE_USER');
    console.log('获取到的数据库用户名为：', DATABASE_USER);
    return this.userService.getUsers();
  }
  @Post()
  addUsers(): any {
    return this.userService.addUsers();
  }
}

```

![image-20240325171050738](C:\Users\Joon\AppData\Roaming\Typora\typora-user-images\image-20240325171050738.png)

小结：注意如果想app下的所有子模块都能获取到这个配置文件我们需要在app.module.ts设置``isGlobal: true``

这种库只能实现配置文件的读取，好像不能区分开发环境去读取配置文件。









### 第二章:kissing_heart:

### 1.解析yml配置文件

我们将使用node中的redfile模块去完成开发环境和生产环境的配置文件获取

#### 1.1安装依赖：

* npm i js-yaml 
* npm i -D @types/js-yaml
* pnpm i process

#### 1.2创建配置文件：

在根目录下创建config文件夹在里面放上config.yml

````yaml
http:
  port: 8080

db:
  postgres:
    port: 5432

  sqlite:
````

在根目录下创建config文件夹在里面放上config.production.yml

```yaml
http:
  host: 'localhostPRO'

db:
  postgres:
    url: 'this is production postgres url'
    database: 'yaml-dbPRO'

  sqlite:
    database: 'sqlite.dbPRO'
```

在根目录下创建config文件夹在里面放上config.development.yml

```yaml
http:
  host: 'localhostDEV'

db:
  postgres:
    url: 'this is development postgres url'
    database: 'yaml-dbDEV'

  sqlite:
    database: 'sqlite.dbDEV'
```



#### 1.3创建一个读取函数  configuration.ts

```ts
/* eslint-disable */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'lodash';
const YAML_CONFIG_FILENAME = 'config/config.yml';
const filePath = join(__dirname, '../', YAML_CONFIG_FILENAME);
const envfilePath = join(
  __dirname,
  '../',
  `config/config.${process.env.NODE_ENV || 'development'}.yml`,
);
const commonConfig = yaml.load(readFileSync(filePath, 'utf8'));
const envConfig = yaml.load(readFileSync(envfilePath, 'utf8'));
// 为什么要导出一个函数呢？
// 因为在Nestjs中，我们一般会将配置信息放在一个模块中，然后在其他模块中通过一个函数来获取配置信息。
// 这样做的好处是可以将配置信息和业务逻辑分离，使得代码更加清晰。
// 另外，在Nestjs中，我们一般会将配置信息放在一个单独的文件中，比如config.yml。
// 而在其他模块中，我们只需要调用这个函数就可以获取到配置信息。
export default () => {
  return _.merge(commonConfig, envConfig); // 读取yaml配置文件并解析为json对象返回
};
```

不要以为commonConfig没用 看看我的解释

```bash
在 _.merge(commonConfig, envConfig) 中，
如果envConfig和commonConfig中有相同的属性，则envConfig的属性会覆盖commonConfig的属性。
这意味着在合并后的结果中，来自envConfig的属性值会取代来自commonConfig的相应属性值。
举例来说，如果commonConfig中有一个名为serverPort的属性，而envConfig中也有一个同名的属性，
并且在调用_.merge(commonConfig, envConfig)时envConfig排在前面，则合并后的结果中serverPort的值将取自envConfig而不是commonConfig。 
```

#### 1.4没用的废话 估计你也不看

这种读取函数 是否能解析呢 我们来看看源码

打开你的app.module.ts  找到imports 按住ctrl键 单机ConfigModule 打开源码 继续找到这一行

```ts
  static forRoot(options?: ConfigModuleOptions): DynamicModule;
```

继续按住ctrl键单机ConfigModuleOptions跳转到 该源码界面 可以看见什么

```ts
 /**
 * Array of custom configuration files to be loaded.
 * See: https://docs.nestjs.com/techniques/configuration
 */
load?: Array<ConfigFactory>;
```

Load是什么：* 要加载的自定义配置文件数组。 那可太简单了 直接给他个json格式数组 读取就完事了呗

#### 1.5修改package.json

```bash
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:debug": "nest start --debug --watch",
"start:prod": "cross-env NODE_ENV=production node dist/src/main",
```

#### 1.5修改app.module.ts

```ts
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HomeworkModule } from './homework/homework.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'configuration'; //define the configuration file path
@Module({
  // 导入配置模块
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], //加载配置文件
    }),
    UserModule,
    HomeworkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

尝试读取

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseConfig } from '../types/interface';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    console.log('官方库的获取', dbUser); // 这里来测试
    console.log('yml获取配置', this.configService.get<DatabaseConfig>('db'));
    return this.appService.getHello();
  }
}
```

```shell
官方库的获取 Joon
yml获取配置 {
  postgres: {
    port: 5432,
    url: 'this is development postgres url',
    database: 'yaml-dbDEV'
  },
  sqlite: { database: 'sqlite.dbDEV' }
}
```

大家可以尝试一下  pnpm start:prod    pnpm start:dev

### 2.解析env

本节将采用.env当公共的配置文件 同样的他和yml文件一个会进行覆盖配置项

#### 2.1安装依赖：

* npm i cross-env
* npm i dotenv

#### 2.2添加配置文件：

* .env.development

  ```bash
  # DATABASE_USER=Joon(DEV)
  DATABASE_PASSWORD=123321(DEV)
  DATABASE_NAME=learn-config(DEV)
  ```

  

* .env.production

  ```bash
  DATABASE_USER=Joon(PRD)
  DATABASE_PASSWORD=123321(PRD)
  DATABASE_NAME=learn-config(PRD)
  ```

  

* .env

  ```bash
  DATABASE_USER=Joon(BASE)
  DATABASE_PASSWORD=123321(BASE)
  DATABASE_NAME=learn-config  (BASE)
  DATA="EVN或者PRO没用的配置"
  ```

  

#### 2.3修改package.json

```bash
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:debug": "nest start --debug --watch",
"start:prod": "cross-env NODE_ENV=production node dist/src/main",
```

不要问我为什么重复我怕你没看第一节课就过来了 带着你重复修改一下 防止你报错

#### 设置`app.module.ts`

默认是`development`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      // 这里新增.env的文件解析
      load: [() => dotenv.config({ path: '.env' })],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 3.解析Json配置文件:smile_cat:(我的最爱)

本节采用config库去解析json文件做为nesjs的配置文件

#### 1.安装第三方包

```bash
npm i config -S
npm i cross-env -D
```

#### 2.新建 配置文件`config/`

 `default.json：`

```json
{
  "server": {
    "happy": "my default value"
  }
}
```

`development.json`:

```json
{
  "server": {
    "port": 3001,
    "host": "localhost",
    "username": "test",
    "password": "test"
  }
}
```

`production.json`:

```json
{
  "server": {
    "port": 3002,
    "host": "localhost",
    "username": "prod",
    "password": "prod"
  }
}
```

#### 3.在`app.controller.ts`中使用：

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as config from 'config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const server = config.get('server');
    console.log(server);
    return this.appService.getHello();
  }
}
```

#### 4.配置脚本：

```bash
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:prod": "cross-env NODE_ENV=production node dist/main",
```

#### 5.运行结果：

```bash
➜ npm run start:dev
获取json配置 {
  happy: 'my default value',
  port: 3001,
  host: 'localhost',
  username: 'test',
  password: 'test'
}

➜ npm run start:prod
获取json配置 {
  happy: 'my default value',
  port: 3002,
  host: 'localhost',
  username: 'prod',
  password: 'prod'
}
```

### 小结：

到这里一共亮出了四种解决配置文件方案基本在开发中够用了，大家着重选取自己喜欢的方式去配置你的api接口

我最喜欢json配置文件:smiley:

## 第三章(配置验证)

配置验证，主要是指在应用程序启动时，如果没有提供所需的环境变量或不符合某些验证规则，就会抛出一个异常。`@nestjs/config`包实现了两种不同的方式来实现这一点。

- `Joi`内置验证器。通过[Joi](https://www.npmjs.com/package/joi)，你可以定义一个对象模式，并根据它验证JavaScript对象
- 一个自定义的`validate()`函数，它将环境变量作为输入

### 1.Joi

特别说明：

- 最新版本的`joi`需要你运行Node v12或更高版本。旧版本的node请安装`v16.1.8`。这主要是因为在`v17.0.2`发布后，在构建的时候会出现错误。更多信息请参考其17.0.0发布说明，[点击这里](https://joi.dev/resources/changelog/)。
- joi最好配合官方的`@nestjs/config`进行使用

步骤：

- 安装依赖

  ```
  npm install --save joi
  ```

- 定义验证Schema：

  ```typescript
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import * as Joi from 'joi';
  import { ConfigModule } from '@nestjs/config';
  
  const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
  
  @Module({
    imports: [
      ConfigModule.forRoot({
        envFilePath: envPath,
        // 这里多了一个属性：validationSchema
        validationSchema: Joi.object({
          NODE_ENV: Joi.string()
            .valid('development', 'production', 'test', 'provision')
            .default('development'),
          PORT: Joi.number().default(3000),
          DATABASE_USER: Joi.string().required()
        }),
      }),
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  
  ```

- 验证测试

  配置`错误`脚本：

  ```
  "start:dev": "cross-env NODE_ENV=development PORT=toimc nest start --watch",
  ```

  配置正确的脚本：

  ```
  "start:dev": "cross-env NODE_ENV=development PORT=3000 nest start --watch",
  ```

  测试命令

  ```
  npm run start:dev
  ```

  错误的提示：

  ```bash
  [下午7:33:38] Found 0 errors. Watching for file changes.
  
  /Users/macos/Projects/nestjs/nestjs-common-template/node_modules/_@nestjs_config@0.6.3@@nestjs/config/dist/config.module.js:61
                  throw new Error(`Config validation error: ${error.message}`);
                  ^
  
  Error: Config validation error: "PORT" must be a number
      at Function.forRoot (/Users/macos/Projects/nestjs/nestjs-common-template/node_modules/_@nestjs_config@0.6.3@@nestjs/config/dist/config.module.js:61:23)
      at Object.<anonymous> (/Users/macos/Projects/nestjs/nestjs-common-template/dist/app.module.js:21:35)
      at Module._compile (internal/modules/cjs/loader.js:1063:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
      at Module.load (internal/modules/cjs/loader.js:928:32)
      at Function.Module._load (internal/modules/cjs/loader.js:769:14)
      at Module.require (internal/modules/cjs/loader.js:952:19)
      at require (internal/modules/cjs/helpers.js:88:18)
      at Object.<anonymous> (/Users/macos/Projects/nestjs/nestjs-common-template/dist/main.js:4:22)
      at Module._compile (internal/modules/cjs/loader.js:1063:30)
  ```

  或者修改`.env.development`中的配置信息：

  ```
  DATABASE_USER=
  DATABASE_PASSWORD=test123
  ```

  错误提示：

  ```bash
  /Users/macos/Projects/nestjs/nestjs-common-template/node_modules/_@nestjs_config@0.6.3@@nestjs/config/dist/config.module.js:61
                  throw new Error(`Config validation error: ${error.message}`);
                  ^
  
  Error: Config validation error: "DATABASE_USER" is not allowed to be empty
      at Function.forRoot (/Users/macos/Projects/nestjs/nestjs-common-template/node_modules/_@nestjs_config@0.6.3@@nestjs/config/dist/config.module.js:61:23)
      at Object.<anonymous> (/Users/macos/Projects/nestjs/nestjs-common-template/dist/app.module.js:21:35)
      at Module._compile (internal/modules/cjs/loader.js:1063:30)
      at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
      at Module.load (internal/modules/cjs/loader.js:928:32)
      at Function.Module._load (internal/modules/cjs/loader.js:769:14)
      at Module.require (internal/modules/cjs/loader.js:952:19)
      at require (internal/modules/cjs/helpers.js:88:18)
      at Object.<anonymous> (/Users/macos/Projects/nestjs/nestjs-common-template/dist/main.js:4:22)
      at Module._compile (internal/modules/cjs/loader.js:1063:30)
  ```

结论：使用`Joi`可以很方便对传入应用程序的参数进行验证，可以限制传入的数据类型。

除了上面写的验证以外，还可以加入以下属性来验证输入的**命令参数**：

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_USER: Joi.string().required()
      }),
      validationOptions: { // 这里加
        allowUnknown: false,
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`@nestjs/config`包使用的默认设置是：

- `allowUnknown`：控制是否允许在环境变量中使用未知键。默认为true；
- `abortEarly`：如果为true，则在第一个错误时停止验证；如果为false，则返回所有错误。默认值为false；

注意上面的Joi的用法：

- 主要是校验`process.env`传入的参数
- 主要是校验`envFilePath`初次加载的时候的参数

### 2.`class-validator`

步骤：

- 安装依赖`class-validator`与`class-transformer`

  ```
  npm i class-validator class-transformer
  ```

- 配置效验文件`src/env.validation.ts`

  ```typescript
  import { plainToClass } from 'class-transformer';
  import { IsEnum, IsNumber, validateSync } from 'class-validator';
  
  enum Environment {
    Development = "development",
    Production = "production"
  }
  
  class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;
  
    @IsNumber()
    PORT: number;
  }
  
  export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(
      EnvironmentVariables,
      config,
      { enableImplicitConversion: true },
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
  ```

- 调整`app.module.ts`文件

  ```typescript
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { ConfigModule } from '@nestjs/config';
  import { validate } from './env.validation';
  
  const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
  
  @Module({
    imports: [
      ConfigModule.forRoot({
        envFilePath: envPath,
        validate,
      }),
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

与使用`Joi`验证结果一致。

## 总结 ：

  - 使用第三方的包`config`，可以方便的读取配置信息，但是校验却需要在读取的位置来加，对于不需要验证，而需要全局使用的配置项可以使用这种方式；

  - 官方的`@nestjs/config`可以方便的导入`.env`的文件，同时结合`js-yaml`也可以导入`yaml`格式的配置。

    配置灵活，而且可以配合验证工具`Joi`进行参数的验证（推荐）

    自定义的校验第三方包`class-validator`这里只是冰山一角，后面在学习数据验证的时候还会使用到它；

  