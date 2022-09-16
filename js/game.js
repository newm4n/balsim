class Game {
  constructor(teamLeft, teamRight, ball) {
    this.leftTeamScore = 0;
    this.rightTeamScore = 0;
    this.teamLeft = teamLeft;
    this.teamRight = teamRight;
    this.ball = ball;
    this.state = "play"; // after_goal, play
  }

  onGoal(side) {
    this.state = "after_goal";
    for (let i =0; i < this.teamLeft.players.length; i++) {
      this.teamLeft.players[i].goToZone();
    }
    for (let i =0; i < this.teamRight.players.length; i++) {
      this.teamRight.players[i].goToZone();
    }
    if (side === "left") {
      this.leftTeamScore += 1;
      // todo pick 1 mid player to the center close to the ball
    } else {
      this.rightTeamScore += 1;
      // todo pic 1 mid player to the center close to the ball
    }
    this.ball.location.x = 5000;
    this.ball.location.y = 3200;
    this.ball.altitude = 0; // in cm
    this.ball.direction = 0; // in degree
    this.ball.velocityV = 0; // in cm
    this.ball.velocityH = 0; // in cm
    this.ball.last_kicker = undefined;
  }
}


function drawArr(ctx,arr, stroke,fill) {
  ctx.beginPath();
  for (let i = 0; i < arr.length; i+=2) {
    let xx = (arr[i] * 2);
    let yy = (arr[i+1] *2);
    if (i === 0) {
      ctx.moveTo(xx,yy);
    } else {
      ctx.lineTo(xx,yy);
    }
  }
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.strokeStyle  = stroke;
  ctx.fill();
}
