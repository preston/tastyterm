// Because PUG must be compiled during the webpack process,
// and because we want to use PUG with Ahead of Time Compiling
// and live reload dev server, we need to manually put a new rule
// for PUG compilation into a webpack file for angular cli.
//
// Sadly, this is not supported out fo the box with the `.angular-cli.json file`.
// We must edit another file in node_modules, so in order to not break
// PUG when we run npm install, we run this file every time the dev
// runs npm install. This is done using the
// `postinstall` script in package.json

// Get stuff for working with the filesystem
const fs = require('fs');

// This is the file we will be adding the rule to each time we run npm install
const commonCliConfig = 'node_modules/@angular/cli/models/webpack-configs/common.js';

// This is the exact config line it will be adding.
// EDIT THIS LINE TO CHANGE PUG COMPILE SETTINGS
const pug_rule = `\n{ test: /.pug$/, loader: [ 'html-loader', { loader: "pug-html-loader", options: { doctype: 'html', pretty: true } } ], },`;
//const pug_rule = `\n{ test: /\.pug$/, loader: "apply-loader!pug-loader?self" },`;

// Open the file
fs.readFile(commonCliConfig, (err, data) => {
  if (err) { throw err; }
  const configText = data.toString();

  // Makesure the rule exists
  if (configText.indexOf(pug_rule) > -1) {
    return;
  }

  console.log('-- Inserting .pug webpack rule -- ');

  // Actually add the rule to the file
  const position = configText.indexOf('rules: [') + 8;
  const output = [configText.slice(0, position), pug_rule, configText.slice(position)].join('');

  // Save the file
  const file = fs.openSync(commonCliConfig, 'r+');
  fs.writeFile(file, output);
  fs.close(file);

});
