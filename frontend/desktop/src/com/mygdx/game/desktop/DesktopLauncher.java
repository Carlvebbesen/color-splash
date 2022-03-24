package com.mygdx.game.desktop;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import com.mygdx.game.ColorSplash;

public class DesktopLauncher {
	public static void main (String[] arg) {
		LwjglApplicationConfiguration config = new LwjglApplicationConfiguration();
		//Til version 3:
		//config.setWindowSizeLimits(ColorSplash.V_WIDTH, ColorSplash.V_HEIGHT, 9999, 9999);
		//config.setTitle(ColorSplash.TITLE);
		config.height = ColorSplash.V_HEIGHT;
		config.width = ColorSplash.V_WIDTH;
		config.title = ColorSplash.TITLE;
		new LwjglApplication(new ColorSplash(), config);
	}
}
