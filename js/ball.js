class Ball {
  constructor(x,y) {
    this.location = new Point(x,y);
    this.altitude = 0; // in cm
    this.direction = 0; // in degree
    this.velocityV = 0; // in cm
    this.velocityH = 0; // in cm
    this.last_kicker = undefined;
    this.locked = false;
    this.lockCount = 10;
    this.visible = true;
  }

  setTrajectory(player, direction, velocityV, velocityH) {
    // console.log("Bt > dir : " + direction + " > vvel:" + velocityV + " hvel:" + velocityH + " locked:" + this.locked);
    if(this.locked === false || player.role === "keeper") {
      this.direction = direction;
      this.velocityV = velocityV;
      this.velocityH = velocityH;
      this.last_kicker = player;
      this.locked = true;
      this.lockCount = 10;
    }
  }

  reposition(field, game) {
    if (game.state === "keeperBall") {
      this.visible = false;
      return;
    } else {
      this.visible = true;
    }
    if(this.locked && this.lockCount > 0) {
      this.lockCount--;
    } else if(this.locked && this.lockCount === 0) {
      this.locked = false;
    }
    this.velocityV -= 1;
    this.altitude += this.velocityV;
    if (this.altitude <= 0) {
      this.altitude = 0;
      this.velocityV = 0;
      if (this.velocityH > 0) {
        this.velocityH -= 1;
        if (this.velocityH <= 0) {
          this.velocityH = 0;
        }
      }
    }
    if (this.velocityH > 0) {
      let posA = new Point(this.location.x, this.location.y);
      this.location.moveTo(this.direction, this.velocityH);
      let posB = new Point(this.location.x, this.location.y);
      let ballPath = new Line(posA.x, posA.y, posB.x, posB.y);
      if (posB.x < 0) {
        if (posB.y > 3200-(730/2) && posB.y < 3200-(730/2) + 730 ) {
          game.onGoal("right");
        } else if (posB.y < 3200-(730/2)) {
          game.onBallOutLeftTop(this, posB.x,posB.y);
        } else if (posB.y > 3200-(730/2)+ 730) {
          game.onBallOutLeftBottom(this, posB.x,posB.y);
        }
      } else if (posB.x > field.width) {
        if (posB.y > 3200-(730/2) && posB.y < 3200-(730/2) + 730 ) {
          game.onGoal("left");
        } else if (posB.y < 3200-(730/2)) {
          game.onBallOutRightTop(this, posB.x,posB.y);
        } else if (posB.y > 3200-(730/2)+ 730) {
          game.onBallOutRightBottom(this, posB.x,posB.y);
        } else {
          console.log("OUT OF KNOWN BOUNDARY : " + this.last_kicker.fname);
        }
      } else if (posB.y < 0) {
        game.onBallOutTop(this, posB.x,posB.y);
      } else if (posB.y > field.height) {
        game.onBallOutBottom(this, posB.x,posB.y);
      }
    }
  }

  draw(canvasContext) {
    if (this.visible === false) {
      return;
    }
    canvasContext.save();
    canvasContext.translate(this.location.x, this.location.y);
    canvasContext.beginPath();
    let sizeAdd = (this.altitude / 100) * 20;
    canvasContext.arc(0,0,30 + sizeAdd, 0, 2 * Math.PI);
    canvasContext.closePath();
    canvasContext.fillStyle = "#FFF";
      canvasContext.strokeStyle = "#FF9"
    canvasContext.fill();
    canvasContext.stroke();

    // canvasContext.fillStyle = "white";
    // canvasContext.font = '170px serif';
    // let txt = this.location.x + "," + this.location.y;
    // let txtWidth = canvasContext.measureText(txt).width;
    // canvasContext.fillText(txt, -(txtWidth / 2), -90);

    canvasContext.restore();
  }
}

