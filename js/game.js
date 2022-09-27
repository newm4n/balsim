class Game {
  constructor(teamLeft, teamRight, ball) {
    this.leftTeamScore = 0;
    this.rightTeamScore = 0;
    this.teamLeft = teamLeft;
    this.teamRight = teamRight;
    this.ball = ball;
    this.state = "play"; // after_goal, play, out, throw_in, keeperBall
  }

  isEveryBodyIdle() {
    for (let i = 0; i < this.teamLeft.players.length; i++) {
      let player = this.teamLeft.players[i];
      if (player.intent !== "idle" || !player.zone.isContainPoint(player.location)) {
        return false;
      }
    }
    for (let i = 0; i < this.teamRight.players.length; i++) {
      let player = this.teamRight.players[i];
      if (player.intent !== "idle" || !player.zone.isContainPoint(player.location)) {
        return false;
      }
    }
    return true;
  }

  onKeeperBall() {
    this.state = "keeperBall";
    for (let i = 0; i < this.teamLeft.players.length; i++) {
      if (this.teamLeft.players[i].role !== "keeper" && this.teamLeft.players[i].intent !== "idle") {
        this.teamLeft.players[i].goToZone();
      }
    }
    for (let i = 0; i < this.teamRight.players.length; i++) {
      if (this.teamRight.players[i].role !== "keeper" && this.teamRight.players[i].intent !== "idle") {
        this.teamRight.players[i].goToZone();
      }
    }
  }

  resetGame() {
    for (let i =0; i < this.teamLeft.players.length; i++) {
      let p = this.teamLeft.players[i];
      let pos = p.zone.getRandomPointWithin();
      p.setPosition(pos.x, pos.y);
    }
    for (let i =0; i < this.teamRight.players.length; i++) {
      let p = this.teamRight.players[i];
      let pos = p.zone.getRandomPointWithin();
      p.setPosition(pos.x, pos.y);
    }
    this.ball.location.x = 5000;
    this.ball.location.y = 3200;
    this.ball.altitude = 0; // in cm
    this.ball.direction = 0; // in degree
    this.ball.velocityV = 0; // in cm
    this.ball.velocityH = 0; // in cm
    this.ball.last_kicker = undefined;
  }

  onGoal(side) {
    if (side === "left") {
      this.leftTeamScore += 1;
      // todo pick 1 mid player to the center close to the ball
    } else {
      this.rightTeamScore += 1;
      // todo pic 1 mid player to the center close to the ball
    }
    this.resetGame();
  }

  onBallOutTop(ball, x, y) {
    this.resetGame();
  }

  onBallOutBottom(ball, x, y) {
    this.resetGame();
  }

  onBallOutLeftTop(ball, x, y) {
    this.resetGame();
  }

  onBallOutLeftBottom(ball, x, y) {
    this.resetGame();
  }

  onBallOutRightTop(ball, x, y) {
    this.resetGame();
  }

  onBallOutRightBottom(ball, x, y) {
    this.resetGame();
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
