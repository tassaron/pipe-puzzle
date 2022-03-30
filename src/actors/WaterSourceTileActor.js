import RectangleActor from "muffin-game/actors/RectangleActor";


export default class WaterSourceTileActor extends RectangleActor {
    direction = Math.floor(Math.random() * 4);
    /* 0 - left
     * 1 - right
     * 2 - down
     * 3 - up
     */

    constructor(game) {
        super(game, 73, 73, 0x000000, 0xffffff);

        // Overwrite the outline in the direction water will flow from
        const createFlowIndicator = () => {
            let flowIndicator;
            if (this.direction < 2) {
                // vertical
                flowIndicator = new RectangleActor(game, 4, 73, 0x000000, null);
            } else {
                // horizontal
                flowIndicator = new RectangleActor(game, 73, 4, 0x000000, null);
            }
            this.addChild(flowIndicator);
            switch(this.direction) {
                case 1:
                    flowIndicator.x = 73 - 4;
                    break
                case 2:
                    flowIndicator.y = 73 - 4;
                    break
                case 3:
                    flowIndicator.x = 0;
            }
        };
        this.flowIndicator = createFlowIndicator();
    }
}