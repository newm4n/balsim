class Ball {
  constructor(x,y) {
    this.location = new Point(x,y);
    this.altitude = 0; // in cm
    this.direction = 0; // in degree
    this.velocityV = 0; // in cm
    this.velocityH = 0; // in cm
    this.last_kicker = undefined;
  }

  setTrajectory(player, direction, velocityV, velocityH) {
    this.direction = direction;
    this.velocityV = velocityV;
    this.velocityH = velocityH;
    this.last_kicker = player;
  }

  reposition(field, game) {
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
      let posA = this.location
      this.location.moveTo(this.direction, this.velocityH);
      let posB = this.location
      let ballPath = new Line(posA.x, posB.x, posB.x, posB.y);
      if (field.leftGoal.isIntersects(ballPath)) {
        field.event = "GoalLeft";
      } else if (field.rightGoal.isIntersects(ballPath)) {
        field.event = "GoalRight";
      } else if (field.borderTop.isIntersects(ballPath)) {
        field.event = "BorderTop";
      } else if (field.borderBottom.isIntersects(ballPath)) {
        field.event = "BorderBottom";
      } else if (field.borderLeftTop.isIntersects(ballPath)) {
        field.event = "BorderLeftTop";
      } else if (field.borderLeftBottom.isIntersects(ballPath)) {
        field.event = "BorderLeftBottom";
      } else if (field.borderRightTop.isIntersects(ballPath)) {
        field.event = "BorderRightTop";
      } else if (field.borderRightBottom.isIntersects(ballPath)) {
        field.event = "BorderRightBottom";
      }
    }
  }

  draw(canvasContext) {
    canvasContext.save();
    canvasContext.translate(this.location.x, this.location.y);
    canvasContext.beginPath();
    let sizeAdd = (this.altitude / 100) * 20;
    canvasContext.arc(0,0,30 + sizeAdd, 0, 2 * Math.PI);
    canvasContext.closePath();
    canvasContext.fillStyle = "#FFF";
    canvasContext.fill();
    canvasContext.strokeStyle = "#FF9"
    canvasContext.stroke();
    canvasContext.restore();
  }
}

