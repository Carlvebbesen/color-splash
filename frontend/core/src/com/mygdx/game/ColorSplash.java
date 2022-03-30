package com.mygdx.game;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.mygdx.game.States.GameStateManager;
import com.mygdx.game.States.MenuState;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ColorSplash extends Game {

	public static final int V_WIDTH=412;
	public static final int V_HEIGHT=732;

	public static final String TITLE = "Color Splash";

	private GameStateManager gsm;
	public SpriteBatch batch;

	private Socket socket;

	@Override
	public void create () {
		try {
			socket = IO.socket("https://color-splash.herokuapp.com");
			socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
				@Override
				public void call(Object... args) {
					System.out.println("Hello world");
				}
			});
			System.out.println("trying to connect");
			socket.connect();
			System.out.println(socket.connected());
		} catch ( URISyntaxException e) {
			e.printStackTrace();
		}
		handleSocketEvents();
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
	private void handleSocketEvents(){
		socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
			@Override
			public void call(Object... args) {
				System.out.println("Hello world");
			}
		});
		System.out.println("trying to connect");
		socket.connect();
	};

}
