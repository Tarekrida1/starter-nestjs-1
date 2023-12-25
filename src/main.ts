import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as processImage from 'express-processimage';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from "helmet";

import * as hpp from 'hpp';
import * as bodyParser from 'body-parser';
import { environment } from './environments/environment';
import * as _mongooseAutoIncrement from 'mongoose-auto-increment';
import mongoose from 'mongoose';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
const connection = mongoose.createConnection(process.env.mongoUrl);
 
_mongooseAutoIncrement.initialize(connection);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  //New line
  app.use(compression());
  // app.use(helmet());
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
  }));
  app.use(hpp());
  app.enableCors();
  app.use(bodyParser.json({limit: '500mb'}));
  app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
  app.use(express.static('assets'));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(function (req, res, next) {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.header("Access-Control-Allow-Origin", "*");
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); //vip
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  // app.use(express.static(environment.uploadedFilesDir));
  // app.use(processImage({root: environment.uploadedFilesDir}));
  // Cross-Origin-Resource-Policy: cross-origin
  
  app.use(`/${globalPrefix}/public`,function (req:express.Request, res, next) {
    if(req.query.download) {
      const file = `${environment.uploadedFilesDir}${req.path}`;
      console.log('req.path', req.path)
      console.log('filefilefile', file);
      res.download(file); // Set disposition and send it.
      return
    }
    if(req.url?.includes('.svg')) {
      req.url= req.path;
    }
    next()
},processImage({root: environment.uploadedFilesDir}));
  app.use(`/${globalPrefix}/public`,express.static(environment.uploadedFilesDir));

  if (process.env.NODE_ENV !== 'production') {
    const swaggerOptions: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };
    
    const config = new DocumentBuilder()
    
    .setTitle('english vessel api')
    .setDescription('The english vessel api description')
    .setVersion('1.0')
    .addTag('english vessel')
    .addBearerAuth(
      { 
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header'
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    ).addSecurityRequirements('access-token')

    .build();

    const document = SwaggerModule.createDocument(app, config,swaggerOptions);
    SwaggerModule.setup('api/swagger', app, document);
  }


  const port = process.env.PORT || 3391;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
