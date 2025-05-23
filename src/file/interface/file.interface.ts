import { File } from "../entities/file.entity";

export interface FileWithReadUrl extends File {
    readUrl: string;
}
