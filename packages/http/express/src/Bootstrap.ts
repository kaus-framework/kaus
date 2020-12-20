import { Bootstrap, KLogger } from '@kaus/core';
import { createHttpServer } from '@kaus/http';
import express, { Application } from 'express';

const log = new KLogger('@kaus:express');

let requestId = require('express-request-id');
let compression = require('compression');
let helmet = require('helmet');
let cors = require('cors');

export let app: Application;

Bootstrap.registerModule({
  bootstraper: () => {
    log.info('init express application');

    app = express()
      .use(requestId())
      .use(helmet())
      .use(compression())
      .disable('x-powered-by')
      .use(cors())
      .use(express.json({ limit: '20mb' }))
      .use(express.urlencoded({ limit: '20mb', extended: true }));

    createHttpServer(app);
  },
  shutdown: () => log.info('shutdown express application'),
});
