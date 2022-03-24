package com.mygdx.game.Scenes;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Table;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;
import com.mygdx.game.ColorSplash;


public class Hud {

    private Integer worldTimer;
    private float timeCount;
    private Integer score;
    private BitmapFont font;

    public Hud() {
        worldTimer = 300;
        timeCount = 0;
        score = 0;
        font = new BitmapFont();
    }

    public void draw(SpriteBatch sb, int x, int y) {
        font.draw(sb, worldTimer.toString(), x, y);
    }

    public void updateTimer(float dt) {
        timeCount += dt;
        if (timeCount >= 1) {
            worldTimer--;
            timeCount = 0;
        }

    }

    public void dispose() {
        font.dispose();
    }
}
