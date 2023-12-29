'use strict';

module.exports = (body, cb) => {
	console.log('body', body);

	if (!body) {
		return cb(new Error('invalid jwtdata'));
	}

	require('jsonwebtoken').verify(body.toString('utf8'), process.env.jwtSecret, {
		algorithm: 'HS256'
	}, cb);
};