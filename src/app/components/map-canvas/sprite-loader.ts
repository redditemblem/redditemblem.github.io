import { Assets, Sprite, Texture } from "pixi.js";
import { GifSource, GifSprite } from "pixi.js/gif";

/** Static functions for loading sprite resources */
export abstract class SpriteLoader {

  /** If `assetUrl` has a `.gif` extension, loads and returns a GifSprite. Otherwise, loads and returns a regular Sprite. */
  public static async getExternalSpriteByExtension(alias: string, assetUrl: string) : Promise<Sprite | undefined> {
    if (assetUrl.length < 1)
      return undefined;
    
    if (assetUrl.includes(".gif"))
      return this.getExternalGifSprite(alias, assetUrl);

    return this.getExternalSprite(alias, assetUrl);
  }

  public static async getExternalSprite(alias: string, assetUrl: string) : Promise<Sprite | undefined> {
    let texture: Texture | undefined;
    try {
      texture = await this.loadExternalTextureAsset(alias, assetUrl);
    }
    catch(error){ }
    
    if(texture === undefined) return undefined;
    return new Sprite(texture);
  }

  public static async getExternalGifSprite(alias: string, assetUrl: string) : Promise<GifSprite | undefined> {
    let texture: GifSource | undefined;
    try {
      texture = await this.loadExternalGifAsset(alias, assetUrl);
    }
    catch(error){ }

    if(texture === undefined) return undefined;
    return new GifSprite(texture);
  }

  private static async loadExternalTextureAsset(alias: string, assetUrl: string) : Promise<Texture> {
    return Assets.load<Texture>({
      alias: alias,
      src: assetUrl,
      parser: 'loadTextures'
    });
  }

  private static async loadExternalGifAsset(alias: string, assetUrl: string) : Promise<GifSource> {
    return Assets.load<GifSource>({
      alias: alias,
      src: assetUrl
    });
  }
}