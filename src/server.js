import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const createError = require('http-errors')
const app = express() //t0d
const dotenv = require('dotenv') //t0d
const helmet = require('helmet') //t0d
const cookieParser = require('cookie-parser') //t0d
const logger = require('morgan') //t0d

const {
	PORT,
	NODE_ENV
} = process.env;
const dev = NODE_ENV === 'development';
console.log(`process.env.PORT==> ${process.env.PORT}`)

dotenv.config() //t0d

app.use(express.json({
	limit: '500000mb' //MUST SET THIS HIGH, OTHERWISE LARGE CATALOGS (KEHE) WILL THROW error-request entity too large
	//originally had it set at 50mb, but even that wasn't high enough for KEKE
	//then set it to 500mb, and that worked for large catalogs. However, when bringing HERE geolocation into play for 15,000+
	//geodata points on a map, frontend hangs, so trying setting to absurdly high 500000mb... but that didn't work...
	//^//That was for nodeHub3, rendered with pug; let's see if Svelte/Sapper makes a difference//t0d
}))
app.use(express.urlencoded({
	limit: '500000mb', //MUST SET THIS HIGH, OTHERWISE LARGE CATALOGS (KEHE) WILL THROW error-request entity too large
	extended: true
}))
app.use(helmet()) //t0d
app.use(cookieParser()) //t0d
app.use(logger('dev')) //t0d

//v//do I need this? Functionality associated with http-errors npm module - keeping for now////////////////////////////t0d
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json(err);
});
//^//do I need this? Functionality associated with http-errors npm module - keeping for now////////////////////////////t0d


//v//https://sapper.svelte.dev/docs#Server_routes says this block should be at end of server.js, so leaving it there//t0d
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
//^//https://sapper.svelte.dev/docs#Server_routes says this block should be at end of server.js, so leaving it there//t0d