import readdirp = require("readdirp");
import debugFactory from "debug";
import { Client as NextcloudClient } from "nextcloud-node-client";

const debug = debugFactory("CopyJob");

export { NextcloudClient };

export interface ICopyJobMemento {
    fileFilter?: string[];
    sourceRootFolder?: string;
    targetRootFolder?: string;
    nextcloudClient: NextcloudClient;
    depth?: number;
}

export enum ProcessingStatus {
    initial = "initial",
    running = "running",
    ended = "ended",
}

export interface IProcessingStatus {
    status: ProcessingStatus;
    totalFileSize: number;
    fileList: Array<{ source: string, target: string, size: number }>;
    filesCopied: number;
    fileSizeCopied: number;
    percentageCompleted: number;
}

export class CopyJob {
    private memento: ICopyJobMemento;
    private processingStatus: IProcessingStatus = {
        status: ProcessingStatus.initial,
        fileList: [],
        fileSizeCopied: 0,
        filesCopied: 0,
        percentageCompleted: 0,
        totalFileSize: 0,
    };

    public constructor(options: ICopyJobMemento) {
        this.processingStatus.status = ProcessingStatus.initial;
        this.memento = options;
        if (!this.memento.fileFilter) {
            this.memento.fileFilter = ["**.*"];
        }

        if (!this.memento.depth) {
            this.memento.depth = 10;
        }
        if (!this.memento.sourceRootFolder) {
            this.memento.sourceRootFolder = ".";
        }

        if (!this.memento.targetRootFolder) {
            this.memento.targetRootFolder = ".";
        }
    }

    public setFileFilter(fileFilter: string[]) {
        this.memento.fileFilter = fileFilter;
    }

    public setSourceRootFolder(sourceRootFolder: string) {
        this.memento.sourceRootFolder = sourceRootFolder;
    }
    public setTargetRootFolder(targetRootFolder: string) {
        this.memento.targetRootFolder = targetRootFolder;
    }
    public setDebth(depth: number) {
        this.memento.depth = depth;
    }

    get status(): IProcessingStatus {
        return this.processingStatus;
    }

    public async start() {
        const readdirpOptions = {
            fileFilter: this.memento.fileFilter,
            debth: this.memento.depth,
            alwaysStat: true,
        };
        this.processingStatus.status = ProcessingStatus.running;
        this.processingStatus.totalFileSize = 0;
        this.processingStatus.fileList = [];

        // Use streams to achieve small RAM & CPU footprint.
        // 1) Streams example with for-await.
        for await (const entry of readdirp(this.memento.sourceRootFolder, readdirpOptions)) {
            const { path, stats: { size } } = entry;
            this.processingStatus.totalFileSize += size;
            // debug(`${JSON.stringify({ path, size })}`);
            debug(".");
            const fileName = this.memento.targetRootFolder + "/" + path.replace(/\\/g, "/") + ".txt";
            this.processingStatus.fileList.push({ source: path, target: fileName, size });
        }
        debug("total size:", this.processingStatus.totalFileSize);
        debug("total files:", this.processingStatus.fileList.length);

        this.processingStatus.filesCopied = 0;
        this.processingStatus.percentageCompleted = 0;
        let percentageCompletedPrev: number = -1;
        for (const entry of this.processingStatus.fileList) {
            try {
                await this.memento.nextcloudClient.createFile(entry.target, Buffer.from("this is a test text"));
                this.processingStatus.filesCopied++;
                this.processingStatus.fileSizeCopied += entry.size;
                this.processingStatus.percentageCompleted =
                    Math.round(this.processingStatus.filesCopied / this.processingStatus.fileList.length * 100);

                if (this.processingStatus.percentageCompleted !== percentageCompletedPrev) {
                    debug(this.processingStatus.percentageCompleted + " % (" + this.processingStatus.filesCopied + ")");
                    // debug(filesCopied);
                    percentageCompletedPrev = this.processingStatus.percentageCompleted;
                }
            } catch (e) {
                debug(e);
            }
        }
        this.processingStatus.status = ProcessingStatus.ended;
        debug("Status %O", this.processingStatus);
    }
}
