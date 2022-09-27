
const KeeperCatchDistance = 150;

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

    this.holdBall = false;
    this.ignoreBall = false;
    this.ignoreBallCount = 0;

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
    this.intent = "idle";
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
    if (this.ignoreBallCount > 0) {
      this.ignoreBallCount--;
      if(this.ignoreBallCount === 0) {
        this.ignoreBall = false;
      }
    }
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

    if (game.state === "play") {
      if (this.holdBall) {
        if (this.intent !== "idle") {
          this.goToZone();
        }
        return;
      }

      if (this.role === "attack") {
        if (this.location.distanceTo(opponentTeam.getGoalLine().midPoint()) < 2000.0) {
          this.intent = "shoot_ball";
        } else if (myTeam.currentBallZonePlayer === this || myTeam.getCloserPlayer(undefined, "any", ball.location, 0) === this) {
          this.intent = "carry_ball_to_goal";
        } else if (myTeam.prevBallZonePlayer === this && this.location.distanceTo(ball.location) < 400.0) {
          this.intent = "pass_ball";
        } else {
          if (this.intent !== "idle") {
            this.goToZone();
          }
        }
      } else if (this.role === "mid") {
        if (myTeam.currentBallZonePlayer === this || myTeam.getCloserPlayer(undefined, "any", ball.location, 0) === this) {
          this.intent = "carry_ball_forward";
        } else if (myTeam.prevBallZonePlayer === this) {
          this.intent = "pass_ball";
        } else if ((myTeam.side === "left" && ball.location.x > 8000) || (myTeam.side === "right" && ball.location.x < 2000)) {
          this.intent = "pass_ball";
        }else {
          if (this.intent !== "idle") {
            this.goToZone();
          }
        }
      } else if (this.role === "back") {
        if (myTeam.currentBallZonePlayer === this || myTeam.getCloserPlayer(undefined, "any", ball.location, 0) === this) {
          this.intent = "carry_ball_forward";
        } else if (myTeam.prevBallZonePlayer === this) {
          this.intent = "pass_ball";
        } else {
          if (this.intent !== "idle") {
            this.goToZone();
          }
        }
      } else if (this.role === "keeper") {
        if (this.holdBall) {
          if (this.intent !== "idle") {
            this.goToZone();
          }
        } else if (ball.location.distanceTo(myTeam.getGoalLine().midPoint()) < 1600 && !this.ignoreBall) {
          this.intent = "catch_ball";
        } else {
          if (this.intent !== "idle") {
            this.goToZone();
          }
        }
      }
    } else if (game.state === "keeperBall") {
      if (this.holdBall === true && game.isEveryBodyIdle()) {
        this.intent = "kick_ball_far";
      }
      // todo finish here
    }

    if (this.intent !== "idle") {
      if(this.intent === "catch_ball" && this.location.distanceTo(ball.location) <= KeeperCatchDistance) {
        this.holdBall = true;
        game.onKeeperBall();
        this.goToZone();
        return;
      } else if (this.intent === "kick_ball_far") {
        this.ignoreBall = true;
        ball.location.x = this.location.x;
        ball.location.y = this.location.y;

        let mids = myTeam.getPlayersByRole("mid");
        let idx = Math.floor(Math.random() * mids.length);

        this.heading = this.location.headingTo(mids[idx].location);
        ball.setTrajectory(this,  ball.location.headingTo(mids[idx].location), 15,this.location.distanceTo(mids[idx].location) * 0.025);
        this.holdBall = false;
        this.ignoreBallCount = 30;
        this.ignoreBall = true;
        game.state = "play";
        this.goToZone();
        return;
      }
      if (this.location.distanceTo(ball.location) > 100) {
        this.heading = this.location.headingTo(ball.location);
        this.location.moveTo(this.heading, this.getSpeed());
      } else if(!ball.locked && ball.altitude < this.height) {
        if (this.intent === "shoot_ball" ) {
          let pnt = opponentTeam.getGoalLine().randomPoint();
          this.heading = this.location.headingTo(pnt);
          ball.setTrajectory(this, ball.location.headingTo(pnt), 10,90);
          this.goToZone();
        } else if (this.intent === "pass_ball") {
          let closest = myTeam.getCloserPlayer(this,"any", ball.location, 1000);
          console.log(closest.role);
          this.heading = this.location.headingTo(closest.location);
          ball.setTrajectory(this, ball.location.headingTo(closest.location), 10, ball.location.distanceTo(closest.location) * 0.025);
          this.goToZone();
        } else if (this.intent === "carry_ball_forward" || this.intent === "carry_ball_to_goal") {
          if(opponentTeam.getPlayersInRange(ball.location, 400).length > 0) {
            let closest = undefined;
            if (this.role === "attack") {
              if(ball.location.distanceTo(opponentTeam.getGoalLine().midPoint()) > 2000) {
                closest = myTeam.getCloserPlayer(this, "attack", ball.location, 1000);
              }
            } else {
              let myCloser = myTeam.getPlayersSortCloser(ball.location);
              closest = myCloser[2 + Math.floor(Math.random() * 2)];
            }
            if (typeof closest === "undefined") {
              this.heading = this.location.headingTo(opponentTeam.getGoalLine().midPoint());
              ball.setTrajectory(this, ball.location.headingTo(opponentTeam.getGoalLine().midPoint()), 10,90);
              this.goToZone();
            } else {
              this.heading = this.location.headingTo(closest.location);
              let dist = ball.location.distanceTo(closest.location);
              let velo = 0;
              if (dist < 500) {
                velo = 20;
              } else if (dist < 1000) {
                velo = 40;
              } else if (dist < 2000) {
                velo = 60;
              } else {
                velo = 80;
              }
              ball.setTrajectory(this, ball.location.headingTo(closest.location), 3, velo);
              this.goToZone();
            }
          } else  if (this.intent === "carry_ball_to_goal" ) {
            this.heading = this.location.headingTo(opponentTeam.getGoalLine().midPoint());
            ball.setTrajectory(this,  ball.location.headingTo(opponentTeam.getGoalLine().midPoint()), 0,this.speed * 2.5);
          } else if (this.intent === "carry_ball_forward") {
            if (opponentTeam.side === "left") {
              this.heading = this.location.headingTo(270);
              ball.setTrajectory(this,  270, 0,this.speed * 2.5);
            } else {
              this.heading = this.location.headingTo(90);
              ball.setTrajectory(this,  90, 0,this.speed * 2.5);
            }
          }
        } else {
          this.goToZone();
        }
      }
    } else {
      if (typeof this.destination === "undefined") {
        this.goToZone();
      }
      if (this.location.distanceTo(this.destination) > 100) {
        this.heading = this.location.headingTo(this.destination);
        this.location.moveTo(this.heading, this.getSpeed());
      } else {
        if (Math.random() < 0.005) {
          this.goToZone();
        } else {
          this.heading = this.location.headingTo(ball.location);
        }
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

    // if (this.role === "keeper") {
    //   canvasContext.strokeStyle = "red";
    //   canvasContext.beginPath();
    //   canvasContext.arc(0, 0, KeeperCatchDistance, 0, Math.PI * 2, false);
    //   canvasContext.stroke();
    // }

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

    if (this.holdBall) {
      canvasContext.beginPath();
      canvasContext.arc(0,0 - (this.height),30, 0, 2 * Math.PI);
      canvasContext.closePath();
      canvasContext.fillStyle = "#FFF";
      canvasContext.strokeStyle = "#FF9"
      canvasContext.fill();
      canvasContext.stroke();
    }

    // draw heading indicator
    // canvasContext.lineWidth = 30;
    // canvasContext.strokeStyle = "red";
    // canvasContext.beginPath();
    // canvasContext.arc(0, 0, 100, ToJSDeg(this.heading-15), ToJSDeg(this.heading + 15), false);
    // canvasContext.stroke();

    canvasContext.fillStyle = "white";
    canvasContext.font = '170px serif';
    let txt = this.fname + " " + this.lname;
    let txtWidth = canvasContext.measureText(txt).width;
    canvasContext.fillText(txt, -(txtWidth / 2), -390);

    canvasContext.restore();
  }
}

function ToJSDeg(deg) {
  let diff = (2 / 360) * (deg % 360);
  return (diff -  0.5) * Math.PI;
}

