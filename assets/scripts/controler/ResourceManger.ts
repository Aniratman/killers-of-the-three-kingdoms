import { Asset, AssetManager, resources } from 'cc';

export type AssetConstructor<T = typeof Asset> = new (...args: any[]) => T;

export default class ResourceManager {
    private static __instance: ResourceManager = null;
    static get instance() {
        if (!this.__instance) {
            this.__instance = new ResourceManager();
        }
        return this.__instance;
    }

    private constructor() {}

    public loadResource<T extends Asset>(path: string | string[], type: AssetConstructor<T>, bundle?: AssetManager.Bundle) {
        const promises: Promise<T>[] = [];
        const assetBundle = bundle || resources;
        const urls: string[] = path instanceof Array ? path : [path];
        for (const url of urls) {
            promises.push(
                new Promise((resolve) => {
                    assetBundle.load(url, type, (err, asset: T) => {
                        if (!err) {
                            resolve(asset);
                        } else {
                            console.error(err);
                            resolve(null);
                        }
                    });
                })
            );
        }
        return Promise.all(promises);
    }
}

export const theResourceManager = ResourceManager.instance;
