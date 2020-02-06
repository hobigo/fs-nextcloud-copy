
import { expect } from "chai";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";
import {
  Client,
  FakeServer,
  RequestResponseLogEntry,
} from "nextcloud-node-client";

import { getNextcloudClient } from "./testUtils";

import { CopyJob, ICopyJobMemento, NextcloudClient } from "../src/copyJob";

let client: Client;

// tslint:disable-next-line:only-arrow-functions
// tslint:disable-next-line:space-before-function-paren
describe("01-FS-NEXCLOUD-COPY", function () {

  // tslint:disable-next-line:space-before-function-paren
  beforeEach(async function () {
    if (this.currentTest && this.currentTest.parent) {
      client = await getNextcloudClient(this.currentTest.parent.title + "/" + this.currentTest.title);
    }
  });

  this.timeout(1 * 60 * 1000);

  it("01 copy", async () => {

    // const client: NextcloudClient = new NextcloudClient();
    const options: ICopyJobMemento = {
      targetRootFolder: "/copyTest",
      nextcloudClient: client,
      fileFilter: ["*.*"],
      sourceRootFolder: "dist",
    };

    const job = new CopyJob(options);
    await job.start();

  });
  it("02 todo", async () => {

    const entries: RequestResponseLogEntry[] = [];
    entries.push({
      request: {
        description: "Client get quota",
        method: "PROPFIND",
        url: "/remote.php/webdav/",
      },
      response: {
        body: "<?xml version=\"1.0\"?>\n<d:NOmultistatus xmlns:d=\"DAV:\" xmlns:s=\"http://sabredav.org/ns\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\"><d:response><d:href>/remote.php/webdav/</d:href><d:propstat><d:prop><d:getlastmodified>Tue, 17 Dec 2019 23:21:39 GMT</d:getlastmodified><d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>4710416497</d:quota-used-bytes><d:quota-available-bytes>-3</d:quota-available-bytes><d:getetag>&quot;5df9630302376&quot;</d:getetag></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response><d:response><d:href>/remote.php/webdav/Donnerwetter.md</d:href><d:propstat><d:prop><d:getlastmodified>Mon, 25 Nov 2019 07:56:30 GMT</d:getlastmodified><d:getcontentlength>99</d:getcontentlength><d:resourcetype/><d:getetag>&quot;200fe307b08fcbedb5606bba4ba5354d&quot;</d:getetag><d:getcontenttype>text/markdown</d:getcontenttype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:quota-used-bytes/><d:quota-available-bytes/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/webdav/SofortUpload/</d:href><d:propstat><d:prop><d:getlastmodified>Sun, 15 Dec 2019 13:39:03 GMT</d:getlastmodified><d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>476863281</d:quota-used-bytes><d:quota-available-bytes>-3</d:quota-available-bytes><d:getetag>&quot;5df637777669d&quot;</d:getetag></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:getcontentlength/><d:getcontenttype/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/webdav/bestellung%20buch%20caro.pdf</d:href><d:propstat><d:prop><d:getlastmodified>Wed, 11 Dec 2019 07:55:54 GMT</d:getlastmodified><d:getcontentlength>63320</d:getcontentlength><d:resourcetype/><d:getetag>&quot;cbb8508498c886ff53e4e0f378f9bc49&quot;</d:getetag><d:getcontenttype>application/pdf</d:getcontenttype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:quota-used-bytes/><d:quota-available-bytes/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response><d:response><d:href>/remote.php/webdav/katze/</d:href><d:propstat><d:prop><d:getlastmodified>Tue, 03 Dec 2019 17:19:49 GMT</d:getlastmodified><d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>4233489797</d:quota-used-bytes><d:quota-available-bytes>-3</d:quota-available-bytes><d:getetag>&quot;5de69935b3309&quot;</d:getetag></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat><d:propstat><d:prop><d:getcontentlength/><d:getcontenttype/></d:prop><d:status>HTTP/1.1 404 Not Found</d:status></d:propstat></d:response></d:NOmultistatus>",
        contentType: "application/xml; charset=utf-8",
        status: 207,
      },
    });

    const lclient: Client = new Client(new FakeServer(entries));
    // console.log(JSON.stringify(this.tests[0].title, null, 4));
    let q;
    try {
      q = await lclient.getQuota();
      expect(true, "expect an exception").to.be.equal(false);
    } catch (e) {
      expect(true, "expect an exception").to.be.equal(true);
    }

  });

});
