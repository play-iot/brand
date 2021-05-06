const path = require("path");
const fs = require("fs");
const asyncfs = fs.promises;
const archiver = require("archiver");
const favicons = require("favicons");
const pjson = require("./package.json")

const version = process.argv[2];
const source = `./design/${version}.logo.png`;
const dist = "./dist";
const logo = path.join(dist, "logo");
const manifest = path.join(logo, "manifest");
const zipFile = path.join(dist, "logo.zip");

const configuration = {
  path: "./img/logo", // Path for overriding default icons path. `string`
  appName: pjson.brand, // Your application's name. `string`
  appShortName: null, // Your application's short_name. `string`. Optional. If not set, appName will be used
  appDescription: pjson.description, // Your application's description. `string`
  developerName: pjson.author.name, // Your (or your developer's) name. `string`
  developerURL: pjson.author.url, // Your (or your developer's) URL. `string`
  dir: "auto", // Primary text direction for name, short_name, and description
  lang: "en-US", // Primary language for name and short_name
  background: "#fff", // Background colour for flattened icons. `string`
  theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
  appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
  display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  scope: "/", // set of URLs that the browser considers within your app
  start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
  version: "1.0", // Your application's version string. `string`
  logging: true, // Print logs to console? `boolean`
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
    //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
    //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
    //
    android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    coast: true, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  },
};

const zip = async (_input, _output) => {
  console.log("Archiving artifact...");
  console.log(`- File name: ${zipFile}`);
  const output = fs.createWriteStream(_output);
  const archive = archiver("zip", {
    zlib: { level: 6 }, // Sets the compression level.
  });

  output.on("close", () => console.log(`- File size: ${archive.pointer() / 1024 / 1024} MB`));

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.log(`- Warning: ${err.message}`);
      console.log("");
    } else {
      console.log(`- Warning: ${err.message}`);
      throw err;
    }
  });

  archive.on("error", (err) => {
    console.log(`- Error: ${err.message}`);
    throw err;
  });
  archive.pipe(output);
  archive.directory(_input, false);
  await archive.finalize();
};

const callback = (error, response) => {
  if (error) {
    console.log(error.message); // Error description e.g. "An unknown error has occurred"
    process.exit(10);
  }
  Promise.all([
    ...response.images.map(each => asyncfs.writeFile(path.join(logo, each.name), each.contents)),
    ...response.files.map(each => asyncfs.writeFile(path.join(logo, each.name), each.contents)),
    asyncfs.writeFile(path.join(manifest, "head.html"),
                      `<!DOCTYPE html><html>\n<head>\n${response.html.join("\n")}\n</head>\n</html>`),
  ])
    .catch(err => {
      console.log("Cannot write file to pack folder", err);
      process.exit(20);
    })
    .then(_ => zip(logo, zipFile));
};

asyncfs
  .mkdir(manifest, { recursive: true })
  .then((_) => favicons(source, configuration, callback));
