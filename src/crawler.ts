import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

type InterfaceDefinitionPropTypeBasic = "string" | "number" | "boolean";

interface InterfaceDefinitionProp {
    name: string;
    required: boolean;
    type: Array<InterfaceDefinitionPropTypeBasic>;
}

interface InterfaceDefinitions {
    [key: string]: InterfaceDefinitionProp[];
}

function crawl(dir: string) {
    const absolutePath = join(process.cwd(), dir);

    const dirContent = readdirSync(absolutePath);

    const f = dirContent.reduce((files, entry) => {
        const entryPath = join(absolutePath, entry);
        const stat = statSync(entryPath);
        if (stat.isFile() && extname(entryPath) === ".ts") {
            files.push(dir + "/" + entry);
        } else if (stat.isDirectory()) {
            console.log(entry, `${dir} / ${entry}`);
            files.push(...crawl(dir + "/" + entry));
        }
        return files;
    }, [] as string[]);

    return f;
}

function extractInterfaces(file: string) {
    const f = readFileSync(file);

    console.log(f.toString());
}

function init(dir: string) {
    const files = crawl(dir);
    if (files.length > 0) {
        extractInterfaces(files[0]);
    }
}

init(process.argv[2]);
