import { GlowFilter } from "pixi-filters";
import { ColorMatrixFilter, FillInput } from "pixi.js";
import { StringDictionary } from "../../data/interfaces/common/dictionaries";

/** Static functions for retrieving common sprite filters */
export abstract class SpriteFilters {

  /** Fill color used in place of sprites that failed to load/render. */
  public static readonly missingSpriteFill: FillInput = { color: "fuchsia", alpha: 0.9 };

  //Use a singleton model so we don't keep redefining filters
  private static grayscaleFilter : ColorMatrixFilter;
  private static brightFilter : ColorMatrixFilter;
  private static darkFilter: ColorMatrixFilter;
  private static glowFilters : StringDictionary<GlowFilter> = {};
  private static unitPinnedFilter : GlowFilter;

  /** Filter that makes a sprite fully black and white. */
  public static getGrayscaleFilter() : ColorMatrixFilter {
    if(this.grayscaleFilter !== undefined)
      return this.grayscaleFilter;

    this.grayscaleFilter = new ColorMatrixFilter();
    this.grayscaleFilter.blackAndWhite(true);

    return this.grayscaleFilter;
  }

  /** Filter that increases a sprite's brightness. */
  public static getBrightFilter() : ColorMatrixFilter {
    if(this.brightFilter !== undefined)
      return this.brightFilter;

    this.brightFilter = new ColorMatrixFilter();
    this.brightFilter.brightness(1.6, true);

    return this.brightFilter;
  }

  /** Filter that decreases a sprite's brightness. */
  public static getDarkFilter() : ColorMatrixFilter {
    if(this.darkFilter !== undefined)
      return this.darkFilter;

    this.darkFilter = new ColorMatrixFilter();
    this.darkFilter.brightness(0.5, true);

    return this.darkFilter;
  }

  /** Filter that add a white glow effect around a sprite. */
  public static getUnitPinnedFilter() : GlowFilter {
    if(this.unitPinnedFilter !== undefined)
      return this.unitPinnedFilter;

    this.unitPinnedFilter = new GlowFilter({
      color: '#ffffff',
      distance: 10,
      outerStrength: 4,
      alpha: 0.5
    });

    return this.unitPinnedFilter;
  }

  /**
   * Filter that adds a glow effect in `colorHex` around a sprite.
   * 
   * @param colorHex - A color code in hex format (ex. '#ffffff')
   */
  public static getGlowFilter(colorHex: string) : GlowFilter {
    if(this.glowFilters[colorHex] !== undefined)
      return this.glowFilters[colorHex];

    const filter = new GlowFilter({
      color: colorHex,
      distance: 10,
      outerStrength: 4,
      alpha: 0.6
    });
    this.glowFilters[colorHex] = filter;

    return filter;
  }
}