package com.mygdx.game.Objects;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class GameObject {
    protected Texture image;
    protected int xPos;
    protected int yPos;

    public GameObject(Texture image, int xPos, int yPos) {
        this.image = image;
        this.xPos = xPos;
        this.yPos = yPos;
    }

    public Texture getImage() {
        return this.image;
    }

    public void drawGameObject(SpriteBatch sb) {
        sb.draw(this.image, this.xPos, this.yPos);
    }

    public boolean isObjectClicked() {
        int clickedX = Gdx.input.getX();
        int clickedY = Gdx.input.getY();

        //Checks if click inside x-position of image
        if (clickedX >= xPos && clickedX <= xPos + image.getWidth()) {
            //Checks if click inside y-position of image
            return clickedY >= yPos - image.getHeight() && clickedY <= yPos;
        }
        return false;
    }
}
