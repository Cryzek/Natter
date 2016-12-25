var crypto = require('crypto');

function genRandomString(length) {
	return crypto.randomBytes(length)
				.toString('hex'); /** convert to hexadecimal format */
};

function saltAndHash(password, salt) {
    var salt = salt || genRandomString(16); /** Gives us salt of length 16 */
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    // hash.update(password);
    // var value = hash.digest('hex');
    hash.setEncoding('hex');
    hash.write(password);
    hash.end();
    var value = hash.read();
    return {
        salt: salt,
        passwordHash: value
    };
}

function verify(salt, passwordHash, password) {
	var newPasswordData = saltAndHash(password, salt);
	if(newPasswordData.passwordHash === passwordHash) {
		return true;
	}
	else {
		return false;
	}
}

/*Export it for use*/
module.exports = {
	saltAndHash: saltAndHash,
	verify: verify
};