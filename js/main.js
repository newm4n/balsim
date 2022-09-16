canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height= window.innerHeight

const c = canvas.getContext("2d")

const TA = new Team("left", "red", "red", "red");
const TB = new Team("right","blue", "blue", "blue");

TA.addPlayer(new Player("Mike", "Tyson", "keeper", 13, 100, 100,100));
TA.addPlayer(new Player("Mickey", "Mouse", "back", 13, 100, 100,100));
TA.addPlayer(new Player("Roger", "Rabbit", "back", 13, 100, 100,100));
TA.addPlayer(new Player("Peter", "Parker", "back", 13, 100, 100,100));
TA.addPlayer(new Player("Papa", "Duke", "mid", 13, 100, 100,100));
TA.addPlayer(new Player("Sirupsen", "Logrus", "mid", 13, 100, 100,100));
TA.addPlayer(new Player("Bruce", "Wayne", "mid", 13, 100, 100,100));
TA.addPlayer(new Player("Robb", "Johnson", "mid", 13, 100, 100,100));
TA.addPlayer(new Player("Dick", "Chenney", "attack", 13, 100, 100,100));
TA.addPlayer(new Player("Luke", "Skywalker", "attack", 13, 100, 100,100));
TA.addPlayer(new Player("Hob", "Goblin", "attack", 13, 100, 100,100));

TB.addPlayer(new Player("Tom", "Cruise", "keeper", 13, 100, 100,100));
TB.addPlayer(new Player("Linus", "Torvald", "back", 13, 100, 100,100));
TB.addPlayer(new Player("Jeff", "Bezos", "back", 13, 100, 100,100));
TB.addPlayer(new Player("Tim", "Burton", "back", 13, 100, 100,100));
TB.addPlayer(new Player("Jack", "Ripper", "mid", 13, 100, 100,100));
TB.addPlayer(new Player("John", "Doe", "mid", 13, 100, 100,100));
TB.addPlayer(new Player("Kim", "Ilsung", "mid", 13, 100, 100,100));
TB.addPlayer(new Player("Joseph", "Black", "mid", 13, 100, 100,100));
TB.addPlayer(new Player("Tony", "Manson", "attack", 13, 100, 100,100));
TB.addPlayer(new Player("Ricky", "Mike", "attack", 13, 100, 100,100));
TB.addPlayer(new Player("Michael", "Jackson", "attack", 13, 100, 100,100));

const field = new Field(TA,TB);
const game = new Game(TA,TB,field.ball);

function play() {
  field.reposition(game);
  field.draw(c);
}

function frame() {
  window.requestAnimationFrame(play);
}

const framesPerSecond = 30;

const l = new Line(0,0, 100,-100);
console.log(l.midPoint());


window.setInterval(frame, 1000/framesPerSecond);




