package com.mygdx.game;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.mygdx.game.States.GameStateManager;
import com.mygdx.game.States.MenuState;

public class ColorSplash extends Game {

	public static final int V_WIDTH=412;
	public static final int V_HEIGHT=732;

	public static final String TITLE = "Color Splash";

	private GameStateManager gsm;
	public SpriteBatch batch;

	
	@Override
	public void create () {
		batch = new SpriteBatch();
		gsm = new GameStateManager();
		gsm.push(new MenuState(gsm));
	}

	@Override
	public void render () {
		super.render();
		gsm.update(Gdx.graphics.getDeltaTime());
		gsm.render(batch);
	}
}
