const pjson = require('../package.json');

const full = (d) => {
  d = '    ' + d.replace(/\n/g, '\n    ');
  return `==========================================================


${d}
                               ${pjson.description}
                          
[ © 2021 ${pjson.homepage} ]===========================`;
};

module.exports = {
  name: pjson.brand,
  create: full
}
