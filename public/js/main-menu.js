 // Create the application helper and add its render target to the page
    const app = new PIXI.Application({ width: 1280, height: 720 });

    app.renderer.resize(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.view);

    // Create the sprite and add it to the stage
    let sprite = PIXI.Sprite.from('img/login-button.png');

    app.stage.addChild(sprite);

    // Opt-in to interactivity
    sprite.interactive = true;

    // Shows hand cursor
    sprite.buttonMode = true;

    // Pointers normalize touch and mouse
    //sprite.on('pointerdown', onClick);
    let meatball = true;
    sprite.on('pointerdown', (event) => {
    if(meatball === true) {
    alert('Meatball meatball spaghetti under meat, ravioli ravioli great barrier reef!');
    meatball = false;
}
    else
{
    alert('Ravioli ravioli give me the formuoli');
    meatball = true;
}
});

