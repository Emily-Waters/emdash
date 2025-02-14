"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverse = traverse;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
function traverse(dir, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield promises_1.default.readdir(dir, { withFileTypes: true });
        let i = 0;
        for (const entry of entries) {
            const directive = yield cb(entry, i);
            i++;
            if (directive === "continue") {
                continue;
            }
            else if (directive === "break") {
                break;
            }
            if (entry.isDirectory()) {
                yield traverse(path_1.default.join(entry.parentPath, entry.name), cb);
            }
        }
    });
}
