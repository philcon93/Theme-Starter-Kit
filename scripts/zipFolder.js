var fs = require('fs');
var archiver = require('archiver');

function zipFolder(srcFolder, callback) {
	var CWD = process.cwd();
	console.log(CWD)
	console.log(srcFolder)
	var output = fs.createWriteStream(`${srcFolder}.zip`);
	var archive = archiver('zip', {
	  zlib: { level: 0 } // Sets the compression level.
	});

	output.on('close', function() { callback(); });

	archive.on('error', function(err) { throw err;});

	archive.pipe(output);

	archive.directory(`${srcFolder}`, `${srcFolder}`);

	archive.finalize();
}

module.exports = zipFolder;
