const figlet = require('figlet');
const fs = require('fs').promises;
const path = require('path');

const version = process.argv[2];
const brand = require(`./design/${version}.brand`);
const target = './dist';

const opts = {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true,
};

figlet.text(brand.name, opts, (err, data) => {
  if (err) {
    console.error(err);
    process.exit(10);
  }
  console.log(brand.create(data));
  fs.mkdir(target, { recursive: true }).then(_ => {
    fs.writeFile(path.join(target, 'banner.txt'), brand.create(data)).catch(
      (e) => {
        console.error('Cannot write file to target', e);
        process.exit(20);
      },
    );
  });
});
