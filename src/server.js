import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const app = express() //t0d
const dotenv = require('dotenv') //t0d
const uuid = require('uuid-v4') //t0d
const helmet = require('helmet') //t0d
const cookieParser = require('cookie-parser') //t0d
const logger = require('morgan') //t0d
const fileUpload = require('express-fileupload')

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

// //v//This is some weird Sapper-provided workaround called a 'nonce' to allow for inline JS resources
// //from https://sapper.svelte.dev/docs/:
// //Sapper generates inline <script>s and <style>s, which can fail to execute if
// //headers do not allow javascript or stylesheets sourced from inline resources.
// //To work around this, Sapper can inject a Content Security Policy (CSP)
// //which can be configured with middleware to emit the proper CSP headers. The nonce will be
// //applied to the inline <script>s and <style>s. Here is an example using Express and Helmet:
// //FOR NOW, I"M NOT SURE HOW TO GET THIS TO WORK. KEEP GETTING FOLLOWING ERROR:
// //"Content-Security-Policy needs a default-src but none was provided", so turning off Helmet until this resolved.//t0d

// app.use((req, res, next) => {
// 	res.locals.nonce = uuid() //this sets a UUID value to res.locals.nonce//t0d
// 	next();
// })
// app.use(helmet({
// 	contentSecurityPolicy: {
// 		directives: {
// 			scriptSrc: [
// 				"'self'",
// 				(req, res) => `'nonce-${res.locals.nonce}'` //this apparently tells Helmet the UUID for whatever responses it is
// 				//associated with is safe
// 			]
// 		}
// 	}
// }))
// //^//This is some weird Sapper-provided workaround called a 'nonce' to allow for inline JS resources

app.use(cookieParser()) //t0d
app.use(logger('dev')) //t0d

app.use(fileUpload({
	debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
}))

//if you want to try to set server.timeout, you may need to daisychain your .timeout after the .listen() method below...
//because there is no "server" variable in this setup; it appears to be set up in the app.use(sirv) portion below...
// // server.timeout = 3600000 //set server timeout to 1 hour to avoid timing out on large catalogs --t0d
// server.timeout = 21600000 //set server timeout to 6 hours to avoid timing out on very large HERE marker numbers --t0d
// //(6 hours still doesn't work...)

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
	}).timeout = 21600000; //set server timeout to 6 hours; this appears to work.
//^//https://sapper.svelte.dev/docs#Server_routes says this block should be at end of server.js, so leaving it there//t0d