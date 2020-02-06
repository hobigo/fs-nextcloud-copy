// this must be the first
import { config } from "dotenv";
config();

import debugFactory from "debug";
import {
    Client,
    Server,
    Environment,
    FakeServer,
    RequestResponseLog,
    RequestResponseLogEntry,
} from "nextcloud-node-client";

export const debug = debugFactory("Test");
// console.log(process.env);

export const getNextcloudClient = async (context: string): Promise<Client> => {

    const rrLog: RequestResponseLog = RequestResponseLog.getInstance();
    rrLog.baseDirectory = "test/recordings/";
    await rrLog.setContext(context);

    // use command line parameter to override recording settings
    if (process.argv.find((element) => element === "--record")) {
        const ncserver: Server = new Environment().getServer();
        ncserver.logRequestResponse = true;
        // tslint:disable-next-line:no-console
        console.log("Test recording: " + rrLog.getFileName());
        return new Client(ncserver);
    } else {
        let entries: RequestResponseLogEntry[];
        try {
            entries = await rrLog.getEntries();
        } catch (e) {
            // throw new Error(`Error: recording does not exist for '${context}' file name; '${rrLog.getFileName()}'`);
            // tslint:disable-next-line:no-console
            // console.log(`recording does not exist for '${context}' file name; '${rrLog.getFileName()}'`);
            entries = [];
        }
        const fncserver: FakeServer = new FakeServer(entries);
        return new Client(fncserver);
    }
};
