export async function post(req, res, next) {
  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body==> ${req.body}`)
  console.log(`req.body.data==> ${req.body.data}`)
}

// export async function post(req, res, next) {
//   console.log(`req.body==> ${req.body}`)
// }

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
// 	const { slug } = req.params;

// 	const article = await db.get(slug);

// 	if (article !== null) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify(article));
// 	} else {
// 		next();
// 	}
// }