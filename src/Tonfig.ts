import TOML from '@iarna/toml';
import mergeWith from 'lodash.mergewith';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import objectPath from "object-path";

export type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
        T[P];
}

export class Tonfig {
    private file: string;
    private config: any;

    private __construct() {}

    public static async loadFile(file: string, _defualt?: any) {
        let content: string | Promise<string> = '';

        if (existsSync(file)) {
            content = readFile(file, { encoding: 'utf-8' });
        }

        return Promise.resolve(content).then(async content => {
            return this.loadConfig(content, _defualt).then(config => {
                config.file = file;

                return config;
            });
        });
    }

    public static async loadConfig(config: string, _defualt?: any) {
        return new Promise<Tonfig>(resolve => {
            const tonfig = new Tonfig();

            tonfig.config = mergeWith({}, _defualt || {}, TOML.parse(config), (obj1: any, obj2: any) => {
                if (Array.isArray(obj1) && Array.isArray(obj2)) {
                    return [...obj2];
                }
            });

            resolve(tonfig);
        });
    }

    public get<T>(path: objectPath.Path, fallback?: T) {
        return objectPath.get(this.config, path, fallback) as T;
    }

    public set<T>(path: objectPath.Path, value: T) {
        return objectPath.set(this.config, path, value) as T;
    }

    public insert<T>(path: objectPath.Path, value: T, at?: number) {
        objectPath.insert(this.config, path, value, at);
    }

    public push<T>(path: objectPath.Path, ...values: T[]) {
        objectPath.push(this.config, path, ...values);
    }

    public delete(path: objectPath.Path) {
        return objectPath.del(this.config, path);
    }

    public empty(path: objectPath.Path) {
        objectPath.empty(this.config, path);
    }

    public has(path: objectPath.Path) {
        return objectPath.has(this.config, path);
    }

    public ensureExists<T>(path: objectPath.Path, fallback?: T) {
        return objectPath.ensureExists(this.config, path, fallback);
    }

    public async save(file?: string) {
        file = file || this.file;

        if (!file) return;

        const dir = dirname(file);

        return mkdir(dir, { recursive: true }).then(async () => {
            return writeFile(file, TOML.stringify(this.config));
        });
    }
}
