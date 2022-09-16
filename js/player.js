
class Player {
  constructor(fname,lname,role,speed,stamina,accuracy,technique) {
    this.fname = fname;
    this.lname = lname;
    this.role = role; // keeper, back, mid, attack
    this.speed = speed;
    this.stamina = stamina;
    this.accuracy = accuracy;
    this.tehnique = technique;
    this.heading = 0;

    this.skinColor = "#f5d142";
    this.hairColor = "#594908";
    this.shirtColorA = "#0e86e8";
    this.shirtColorB = "#0c1fc7";
    this.shirtColorC = "#0cb4c7";

    this.intent = "to_ball"; // to_ball, carry_ball, goal_shoot, pass_ball, to_post, idle
    this.activity = "idle"; // sprint, run, walk, idle
    this.currentStamina = 1.0;

    this.height = 170;

    this.location = new Point(0,0);
  }
  getSpeed() {
    return this.speed * this.currentStamina;
  }
  getAccuracy() {
    return this.accuracy * this.currentStamina;
  }
  setZone(zone) {
    this.zone = zone;
    let pos = this.zone.getRandomPointWithin();
    this.setPosition(pos.x, pos.y);
  }
  goToZone() {
    this.intent = "to_post";
    this.activity = "sprint";
    this.destination = this.zone.getRandomPointWithin();
  }
  setPosition(x,y) {
    this.location.x = x;
    this.location.y = y;
  }
  setPersona(skinColor, hairColor, height) {
    this.skinColor = skinColor;
    this.hairColor = hairColor;
    this.height = height;
  }
  setPersonUniform(a,b,c) {
    this.shirtColorA = a;
    this.shirtColorB = b;
    this.shirtColorC = c;
  }

  reposition(myTeam, opponentTeam, ball, game) {

    if (this.currentStamina <= 1.0 && this.currentStamina >= 0.3) {
      if (this.activity === "idle") {
        this.currentStamina += 0.02;
      } else if (this.activity === "walk") {
        this.currentStamina += 0.01;
        if (this.currentStamina > 0.5) {
          this.activity = "run";
        }
      } else if (this.activity === "run") {
        this.currentStamina -= 0.03;
        if (this.currentStamina < 0.3) {
          this.activity = "walk";
        }
      } else if (this.activity === "sprint") {
        this.currentStamina -= 0.06;
        if (this.currentStamina < 0.7) {
          this.activity = "run";
        }
      }
    }

    if (this.intent === "to_post") {
      this.heading = this.location.headingTo(this.destination);
      this.location.moveTo(this.heading, this.getSpeed());
      if (this.location.distanceTo(this.destination) < 100) {
        this.intent = "idle";
        this.activity = "idle";
      }
    }

    if (this.role === "attack") {
      // if carry ball (distance to ball is 1.5 meter) and location to goal is less than 10 meter
    if (this.location.distanceTo(ball.location) < 100 && this.location.distanceTo(opponentTeam.getGoalLine().midPoint()) < 1500.0) {
        // carry ball closer to enemy goal
        this.heading = this.location.headingTo(ball.location);
        this.intent = "goal_shoot";
        this.activity = "sprint";
        ball.setTrajectory(this, ball.location.headingTo(opponentTeam.getGoalLine().midPoint()), 10,90);
      }
      // if carry ball (distance to ball is 1.5 meter) and location to goal is less than 30 meter
      else if (this.location.distanceTo(ball.location) < 100.0 && this.location.distanceTo(opponentTeam.getGoalLine().midPoint()) < 3000.0) {
        // carry ball closer to enemy goal
        this.heading = this.location.headingTo(ball.location);
        this.intent = "carry_ball";
        this.activity = "sprint";
        ball.setTrajectory(this,  ball.location.headingTo(opponentTeam.getGoalLine().midPoint()), 0,this.speed * 2.5);
      }

      // distance to ball is less than 20 meters and distance to goal is less than 30 meters, then chase the ball
      else if (this.location.distanceTo(ball.location) < 2000 && this.location.distanceTo(opponentTeam.getGoalLine().midPoint()) < 3000 ) {
          // chase ball
        this.heading = this.location.headingTo(ball.location);
        this.intent = "to_ball";
        this.activity = "sprint";
        this.location.moveTo(this.heading, this.getSpeed());
      }
    }

  }

  draw(canvasContext) {
    canvasContext.save();
    canvasContext.translate(this.location.x, this.location.y);
    canvasContext.strokeStyle = "yellow";
    canvasContext.fillStyle = "red";
    canvasContext.arc(this.location.x,this.location.y,100, 0,0,false);

    let head = [0,-160,8,-160,14,-152,14,-132,8,-126,-8,-126,-14,-132,-14,-152,-8,-160];
    let neck = [8,-126,8,-107,-8,-107,-8,-127];
    let shirt = [3,-110,8,-120,14,-120,28,-107,28,-100,16,-100,16,-85,-16,-85,-16,-100,-28,-100,-28,-107,-14,-120,-8,-120,-3,-110];
    let short = [16,-85,16,-55,0,-55,0,-78,0,-55,-16,-55,-16,-85];
    let shirtArm1 = [14,-120,28,-107,28,-100,16,-100];
    let shirtArm2 = [-14,-120,-28,2-107,-28,-100,-16,-100];
    let arm1 = [16,-100,26,-100,26,-79,16,-79];
    let arm2 = [-16,-100,-26,-100,-26,-79,-16,-79];
    let leg1 = [3,-55,13,-55,13,-35,3,-35];
    let leg2 = [-3,-55,-13,-55,-13,-35,-3,-35];
    let sock1 = [3,-35,13, -35,13,-15,3,-15];
    let sock2 = [-3,-35,-13,-35,-13,-15,-3,-15,];
    let shoe1 = [3,-15,13,-15,26,-3,26,0,3,0];
    let shoe2 = [-3,-15,-13,-15,-26,-3,-26,0,-3,0];

    drawArr(canvasContext,  shoe1, "black", "black");
    drawArr(canvasContext,  shoe2, "black", "black");

    drawArr(canvasContext, sock1, "black", this.shirtColorC);
    drawArr(canvasContext, sock2, "black", this.shirtColorC);
    //
    drawArr(canvasContext, leg1, "black", this.skinColor);
    drawArr(canvasContext, leg2, "black", this.skinColor);
    //
    drawArr(canvasContext, shirt, "black", this.shirtColorA);
    drawArr(canvasContext, shirtArm1, "black", this.shirtColorC);
    drawArr(canvasContext, shirtArm2, "black", this.shirtColorC);

    drawArr(canvasContext, short, "black", this.shirtColorB);

    //
    drawArr(canvasContext, arm1, "black", this.skinColor);
    drawArr(canvasContext, arm2, "black", this.skinColor);
    //
    drawArr(canvasContext, neck, "black", this.skinColor);
    drawArr(canvasContext, head, "black", this.skinColor);

    canvasContext.restore();
  }
}

