import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const tsqlHubRouter = require('../../../backendLogic/express_routes/rt-tsqlHub') //t0d

const app = express() //t0d
const dotenv = require('dotenv') //t0d
dotenv.config() //t0d

const {
	PORT,
	NODE_ENV
} = process.env;
const dev = NODE_ENV === 'development';

console.log(`process.env.PORT==> ${process.env.PORT}`)
console.log(`process.env.SOMETHING==> ${process.env.SOMETHING}`)

// app.use('/tsqlHub', tsqlHubRouter) //t0d

app // You can also use Polka
	.use(
		compression({
			threshold: 0
		}),
		sirv('static', {
			dev
		}),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});