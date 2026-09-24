import { NineSliceSprite, Texture } from "pixi.js";

export class TileCursorSprite extends NineSliceSprite {

    //Constants
    /** The number of milliseconds between animation frames */
    private readonly SPRITE_ANIMATION_INTERVAL: number = 200;

    //Internal attributes
    private cursorIncrementBy: number = 2;

    constructor(private readonly tileDimensions: number) {
        const texture = Texture.from('tile_cursor'); //texture is preloaded in `loadCommonAssets()`
        
        //Call base constructor with options object
        super({
            label: 'Cursor',
            texture: texture,
            leftWidth: 7,
            topHeight: 7,
            rightWidth: 7,
            bottomHeight: 7,
            height: tileDimensions + 2,
            width: tileDimensions + 2,
            anchor: 0.5, //manipulate relative to center
            interactive: false,
            interactiveChildren: false,
            eventMode: 'none'
        });

        //Set up animation interval
        setInterval(() => {
            this.setSize(this.height + this.cursorIncrementBy);

            //Invert increment at bounds
            if(this.height >= this.tileDimensions+6) this.cursorIncrementBy = -2;
            else if(this.height <= this.tileDimensions+2) this.cursorIncrementBy = 2;
        }, this.SPRITE_ANIMATION_INTERVAL);
    }
}