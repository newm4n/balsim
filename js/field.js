class Field {
  constructor(teamA,teamB) {
    this.teamA = teamA;
    this.teamA.assignPlayerZone("left");
    this.teamB = teamB;
    this.teamB.assignPlayerZone("right");
    this.ball = new Ball(5000, 3200);
    this.ball.setTrajectory(undefined, 210, 0,0);

    this.event = "gameOn";
    this.width = 10000;
    this.height = 6400;

    this.borderTop = new Line(0,0,10000, 0);
    this.borderBottom = new Line(0,6400, 10000,6400);
    this.borderLeftTop = new Line(0,0,0, 3200-(730/2));
    this.borderLeftBottom = new Line(0,3200-(730/2),0, 6400);
    this.borderRightTop = new Line(10000,0,10000, 3200-(730/2));
    this.borderRightBottom = new Line(10000,3200-(730/2),10000, 6400);
    this.leftGoal =  new Line(0,3200-(730/2), 0, 3200+(730/2));
    this.rightGoal = new Line(10000,3200-(730/2), 10000, 3200+(730/2));


  }


  reposition(game) {
    this.ball.reposition(this, game);
    this.teamA.reposition(this.teamB, this.ball, game);
    this.teamB.reposition(this.teamA, this.ball, game);
  }

  draw(canvasContext) {
    canvasContext.save();
    let zoom = 0.09;
    // zoom transform
    // canvasContext.transform(zoom, 0,0,zoom,0,0);
    canvasContext.translate(25,25);
    canvasContext.scale(zoom,zoom);

    this.drawField(canvasContext);

    let allToDraw = [];
    for (let i=0; i<this.teamA.players.length; i++) {
      allToDraw.push(this.teamA.players[i]);
    }
    for (let i=0; i<this.teamB.players.length; i++) {
      allToDraw.push(this.teamB.players[i]);
    }
    allToDraw.push(this.ball);

    allToDraw.sort( function(a,b) {
      if(a.location.y > b.location.y) return 1;
      if(a.location.y < b.location.y) return -1;
      return 0;
    });

    for (let i = 0; i < allToDraw.length; i++) {
      allToDraw[i].draw(canvasContext);
    }

    // this.teamA.draw(canvasContext);
    // this.teamB.draw(canvasContext);
    // this.ball.draw(canvasContext);

    canvasContext.restore();
  }

  drawField(ctx) {
    ctx.lineWidth = 15;
    ctx.fillStyle = "#00A000";
    ctx.fillRect(-1000, -1000, 11500, 7800);
    ctx.fillStyle = "#009000";
    ctx.fillRect(0, 0, 1000, 6400);
    ctx.fillRect(2000, 0, 1000, 6400);
    ctx.fillRect(4000, 0, 1000, 6400);
    ctx.fillRect(6000, 0, 1000, 6400);
    ctx.fillRect(8000, 0, 1000, 6400);

    ctx.strokeStyle = "#FFF";
    ctx.strokeRect(0, 0, 10000, 6400);

    // middle line
    ctx.moveTo(5000,0);
    ctx.lineTo(5000, 6400);
    ctx.stroke();

    // middle circle
    ctx.beginPath();
    ctx.arc(5000, 3200, 950, 0, 2 * Math.PI, false);
    ctx.stroke();

    // penalty spot
    ctx.beginPath();
    ctx.arc(1100, 3200, 30, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5000, 3200, 30, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10000-1100, 3200, 30, 0, 2 * Math.PI, false);
    ctx.stroke();

    // half circles
    ctx.beginPath();
    ctx.arc(1100, 3200, 915, -0.98, 0.98, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10000-1100, 3200, 915, 2.16, 4.12, false);
    ctx.stroke();

    // left gual squares
    ctx.strokeRect(0, 1200, 1600, 4000);
    ctx.strokeRect(0, 3200-900, 550, 1800);

    // right goal squares
    ctx.strokeRect( 10000-1600, 1200, 1600, 4000);
    ctx.strokeRect(10000-550, 3200-900, 550, 1800);

    // goal post
    ctx.fillStyle = "red";
    ctx.fillRect(-200,3200-(730/2), 200,730 );
    ctx.fillRect(10000,3200-(730/2), 200,730 );

    ctx.fillStyle = "white";
    ctx.font = '250px serif';
    let txt = "LEFT : " + game.leftTeamScore + "   vs   "+ game.rightTeamScore +" : RIGHT";
    let txtWidth = ctx.measureText(txt).width;
    ctx.fillText(txt, (this.width/2)-(txtWidth / 2), this.height + 220);

    ctx.stroke();

  }
}
