
Make a pacman as a plain javascript application that I can play in the browser and that has

- the pacman
- maze
- little green points that the pacman can eat
- ghosts that hunt the pacman
- a score under the maze
- and an overlay "game over" or "won" message

First we see an overlay message "Press space to start". The pacman should be controlled using the arrow keys and the ghosts should have a simple algorithm that makes them change direction.

Ideally we also can play it on smartphones (size of maze).

Indent all codes with 2 spaces and put the { on the next line. Put the js code in controller.js and styles in styles.css. Add a hard coded timestamp like ?v=202506111002.

---------------------------------------------------------------

[AI agent runs]

---------------------------------------------------------------

I have moved the game to a new dir cause I published it on github.

Some things to improve:

- the walls of the maze are a little bit too thick
- the pacman and the ghoste are too small
- the pacman has no mouth and no eye

---------------------------------------------------------------

[AI agent runs]

---------------------------------------------------------------

That is better. Make the pacman and just a little slower moving so that it is easier to change direction using the keyboard. Currently it's a little hard to press the button soon enough. Also make the ghosts move at the same speed as the pacman.

---------------------------------------------------------------

[AI agent runs]

---------------------------------------------------------------

For playing on smartphones we need to add some keys below the score that are used to control the pacman. Also add a key to replace the space bar. On PC just use the keyboard controls as currently (but keep the controls visible).

---------------------------------------------------------------

[AI agent runs]
