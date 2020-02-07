// this must be the first
import { config } from "dotenv";
config();

import debugFactory from "debug";
const debug = debugFactory("xxx");
debug("xx");

import { CopyJob, ICopyJobMemento, NextcloudClient } from "./copyJob";

(async () => {
  // const job = new CopyJob({ fileFilter: ["*.css"] });
  const client: NextcloudClient = new NextcloudClient();
  const options: ICopyJobMemento = {
    targetRootFolder: "/copyTest",
    nextcloudClient: client,
    fileFilter: ["*.ts"],
    sourceRootFolder: "src",
  };

  const job = new CopyJob(options);
  await job.start();

})();
