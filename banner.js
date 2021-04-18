const figlet = require("figlet");
const fs = require("fs").promises;
const path = require("path");

const target = "./pack";

const banner = (d) => {
  return `=======================================================

${d}
                             IIoT platform as-a-service

==============[ © 2021 https://qweio.app ]=============`;
};

const opts = {
  font: "Standard",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
};

figlet.text(`QWE-iO`, opts, (err, data) => {
  if (err) {
    console.error(err);
    process.exit(10);
  }
  console.log(banner(data));
  fs.writeFile(path.join(target, "banner.txt"), banner(data)).catch((e) => {
    console.error("Cannot write file to target", e);
    process.exit(20);
  });
});
