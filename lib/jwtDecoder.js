'use strict';

const JWT = require('jsonwebtoken');

module.exports = (body, cb) => {
	console.log('body', body);

	if (!body) {
		return cb(new Error('invalid jwtdata'));
	}

	return JWT.verify(body.toString('utf8'), process.env.jwtSecret, {
		algorithm: 'HS256'
	});
};