package com.mygdx.game.Objects;

import com.badlogic.gdx.graphics.Texture;

public class Button extends GameObject{

    private Texture image;
    private int xPos;
    private int yPos;

    public Button(Texture image, int xPos, int yPos) {
        super(image, xPos, yPos);
    }


}
