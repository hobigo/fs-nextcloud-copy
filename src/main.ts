import { a } from "./xx";

import readdirp = require("readdirp");

async function bootstrap() {

  // Use streams to achieve small RAM & CPU footprint.
  // 1) Streams example with for-await.
  for await (const entry of readdirp(".",
    { fileFilter: "*.js", alwaysStat: true })) {
      const {path, stats: {size}} = entry;
      console.log(`${JSON.stringify({path, size})}`);
  }
}
bootstrap();
