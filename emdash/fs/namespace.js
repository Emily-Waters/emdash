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
exports.namespace = namespace;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const traverse_1 = require("./traverse");
function namespace(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, traverse_1.traverse)(dir, (entry, idx) => __awaiter(this, void 0, void 0, function* () {
            const indexPath = path_1.default.join(entry.parentPath, "index.ts");
            if (idx === 0) {
                yield promises_1.default
                    .access(indexPath)
                    .then(() => promises_1.default.unlink(indexPath))
                    .catch(() => { });
            }
            if (entry.name === "index.ts")
                return "continue";
            if (entry.name.startsWith("."))
                return "continue";
            if (entry.name.startsWith("__"))
                return "continue";
            const fileName = entry.name.split(".")[0];
            const content = `import { ${fileName} as _${fileName} } from "./${fileName}";\n`;
            yield promises_1.default.appendFile(indexPath, content);
        }));
        yield (0, traverse_1.traverse)(dir, (entry, idx) => __awaiter(this, void 0, void 0, function* () {
            if (entry.isDirectory())
                return;
            if (entry.name.startsWith("."))
                return "continue";
            if (entry.name.startsWith("__"))
                return "continue";
            if (entry.name !== "index.ts")
                return "continue";
            const indexPath = path_1.default.join(entry.parentPath, "index.ts");
            const namespace = path_1.default.basename(entry.parentPath);
            let content = yield promises_1.default.readFile(indexPath, "utf-8");
            content += `\nnamespace ${namespace} {\n`;
            const aliases = content.matchAll(/([\w]+) as (_[\w]+)/g);
            for (const alias of aliases) {
                const [_, name, _alias] = alias;
                content += `  export const ${name} = ${_alias};\n`;
            }
            content += "}\n\n";
            if (dir === entry.parentPath) {
                content += `export default ${namespace};`;
            }
            else {
                content += `export { ${namespace} };`;
            }
            yield promises_1.default.writeFile(indexPath, content);
        }));
    });
}
namespace(path_1.default.join((0, process_1.cwd)(), "emdash"));
