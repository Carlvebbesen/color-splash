package com.mygdx.game.States;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.mygdx.game.ColorSplash;
import com.mygdx.game.Objects.Background;
import com.mygdx.game.Objects.GameObject;

public class MenuState extends State {

    private Background background;
    private GameObject playButton;

    public MenuState(GameStateManager gsm) {
        super(gsm);
        Texture button = new Texture("startButton.png");
        playButton = new GameObject(button, (ColorSplash.V_WIDTH/2) - (button.getWidth()/2), ColorSplash.V_HEIGHT/2);
        background = new Background(new Texture("background.png"), ColorSplash.V_WIDTH, ColorSplash.V_HEIGHT);
    }

    @Override
    public void handleInput() {
        if(Gdx.input.justTouched()) {
            if (playButton.isObjectClicked()) {
                gsm.set(new PlayState(gsm));
                dispose();
            }
        }
    }

    @Override
    public void update(float dt) {
        handleInput();
    }

    @Override
    public void render(SpriteBatch sb) {
        sb.begin();
        background.drawBackground(sb);
        playButton.drawGameObject(sb);
        sb.end();
    }

    @Override
    public void dispose() {
        background.getImage().dispose();
        playButton.getImage().dispose();
    }
}
