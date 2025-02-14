import { Dirent } from "fs";
export declare function traverse(dir: string, cb: (entry: Dirent, idx?: number) => "continue" | "break" | void | Promise<"continue" | "break" | void>): Promise<void>;
