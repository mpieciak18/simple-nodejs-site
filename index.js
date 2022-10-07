const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
	// Build dynamic file path
	let filePath = path.join(
		__dirname,
		'public',
		req.url === '/' || req.url === '/home' ? 'index.html' : req.url
	);

	// Declare file extension
	let extension = path.extname(filePath);

	// Declare initial content type
	let contentType = 'text/html';

	// Update content type based on file extension
	if (extension == '.js') contentType = 'text/javascript';
	else if (extension == '.css') contentType = 'text/css';
	else if (extension == '.json') contentType = 'application/json';
	else if (extension == '.jpg') contentType = 'image/jpg';
	else if (extension == '.png') contentType = 'image/png';

	// Check if content type is text/html but file path lacks file extension
	if (contentType == 'text/html' && extension == '') filePath += '.html';

	// Read file & return content
	fs.readFile(filePath, (err, content) => {
		if (err) {
			if (err.code == 'ENOENT') {
				// Page not found
				fs.readFile(
					path.join(__dirname, 'public', '404.html'),
					(err, content) => {
						res.writeHead(200, { 'Content-Type': 'text/html' });
						res.end(content, 'utf-8');
					}
				);
			} else {
				// Other server error
				res.writeHead(500);
				res.end(`Server Error: ${err.code}`);
			}
		} else {
			// Success
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(content, 'utf-8');
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
