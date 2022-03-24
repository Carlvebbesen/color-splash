package com.mygdx.game.Objects;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class Background extends GameObject{

    public Background(Texture image, int xPos, int yPos) {
        super(image, xPos, yPos);
    }

    public void drawBackground(SpriteBatch sb) {
        sb.draw(this.image, 0,0, this.xPos, this.yPos);
    }
}
