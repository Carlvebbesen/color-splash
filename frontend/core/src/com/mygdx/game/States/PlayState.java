package com.mygdx.game.States;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.mygdx.game.Scenes.Hud;

public class PlayState extends State{

    private Texture splash;
    private Texture background;
    private Hud hud;

    private Integer worldTimer;
    private float timeCount;


    protected PlayState(GameStateManager gsm) {
        super(gsm);
        splash = new Texture("splash.png");
        worldTimer = 60;
        timeCount = 0;
        hud = new Hud();
        //background = new Texture();
    }

    @Override
    protected void handleInput() {
        if(Gdx.input.justTouched()) {
            gsm.set(new MenuState(gsm));
            dispose();
        }
    }

    @Override
    public void update(float dt) {
        hud.updateTimer(dt);
        handleInput();
    }

    @Override
    public void render(SpriteBatch sb) {
        sb.begin();
        sb.draw(splash, 0, 0);
        hud.draw(sb, 100, 100);
        sb.end();
    }

    @Override
    public void dispose() {
        splash.dispose();
        hud.dispose();
    }

}
