const figlet = require("figlet");
const fs = require("fs").promises;
const path = require("path");

const version = process.argv[2];
const brand = require(`./design/${version}.brand`);
const target = "./dist";

const create_opts = f => {
  return {
    font: f,
    horizontalLayout: "controlled smushing",
    verticalLayout: "controlled smushing",
    width: 80,
    whitespaceBreak: false
  };
};

// const fonts = [
//   "ANSI Shadow",
//   "Modular",
//   "Georgia11",
//   "Univers",
//   "Roman",
//   // "Nancyj-Improved",
//   // "Big Money-ne",
//   // "Isometric1",
//   // "Small Isometric1",
//   // "Larry 3D",
// ];

// fonts.forEach((f) => {
//   figlet.text(brand.name, create_opts(f), (err, data) => {
//     if (err) {
//       console.error(err);
//       process.exit(10);
//     }
//     console.log(`Font: ${f}`);
//     console.log(brand.create(data));
//     console.log();
//   });
// });

figlet.text(brand.name, create_opts("ANSI Shadow"), (err, data) => {
  if (err) {
    console.error(err);
    process.exit(10);
  }
  console.log(brand.create(data));
  fs.mkdir(target, { recursive: true }).then((_) => {
    fs.writeFile(path.join(target, "banner.txt"), brand.create(data)).catch(
      (e) => {
        console.error("Cannot write file to target", e);
        process.exit(20);
      }
    );
  });
});
