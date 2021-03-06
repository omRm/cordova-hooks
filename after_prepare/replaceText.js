#!/usr/bin/env node

// devgirl.org/2013/11/12/three-hooks-your-cordovaphonegap-project-needs/
// this plugin replaces arbitrary text in arbitrary files

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
	var data = fs.readFileSync(filename, 'utf8');
	var result = data.replace(new RegExp(to_replace, "g"), replace_with);
	fs.writeFileSync(filename, result, 'utf8');
}

var target = "development";
if (process.env.TARGET) {
	target = process.env.TARGET;
}

if (rootdir && target !== 'development') {

	console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log("!! Replacing text based on Environment: " + target);
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

	var ourconfigfile = path.join(rootdir, "../project.json");
	var configobj = JSON.parse(fs.readFileSync(ourconfigfile, 'utf8'));

	// CONFIGURE HERE
	// with the names of the files that contain tokens you want
	// replaced.  Replace files that have been copied via the prepare step.
	var filestoreplace = [
		// ios
		"platforms/ios/myProject/config.xml",
		"platforms/ios/myProject/myProject.plist",
		//android
		"platforms/android/AndroidManifest.xml",
		"platforms/android/res/xml/config.xml",
	];

	filestoreplace.forEach(function(val, index, array) {
		var fullfilename = path.join(rootdir, val);

		if (fs.existsSync(fullfilename)) {

			replace_string_in_file(fullfilename, "BUNDLE_IDENTIFIER", configobj[target].appId);

		} else {
			console.log("missing: " + fullfilename);
		}
	});

}
