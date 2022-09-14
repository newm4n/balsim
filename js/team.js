class Team {
  constructor(side, colorA, colorB, colorC) {
    this.side = side;
    this.players = [];
    this.uniformA = colorA;
    this.uniformB = colorB;
    this.uniformC = colorC;
  }

  getGoalLine() {
    if(this.side === "left") {
      return new Line(0,3200-(730/2), 0, 3200+(730/2));
    }
    return new Line(10000,3200-(730/2), 10000, 3200+(730/2));
  }

  addPlayer(player) {
    player.setPersonUniform(this.uniformA, this.uniformB, this.uniformC);
    this.players.push(player);
  }

  assignPlayerZone(side) {
    let keepers = this.getPlayersByRole("keeper");
    let zs = this.getZones(side, "keeper", 1)
    if (keepers.length > 0) {
      keepers[0].setZone(zs[0])
    }

    let backs = this.getPlayersByRole("back");
    zs = this.getZones(side, "back", backs.length)
    for (let i = 0; i < backs.length; i++) {
      backs[i].setZone(zs[i])
    }

    let mids = this.getPlayersByRole("mid");
    zs = this.getZones(side, "mid", mids.length)
    for (let i = 0; i < mids.length; i++) {
      mids[i].setZone(zs[i])
    }

    let attacks = this.getPlayersByRole("attack");
    zs = this.getZones(side, "attack", attacks.length)
    for (let i = 0; i < attacks.length; i++) {
      attacks[i].setZone(zs[i])
    }
  }

  getPlayerCount(role) {
    return this.getPlayerCount(role).length;
  }

  getPlayersByRole(role) {
    let ret = [];
    for (let i = 0;i < this.players.length; i++) {
      if (this.players[i].role === role) {
        ret[ret.length] = this.players[i];
      }
    }
    return ret;
  }

  getZones(side, role, count) {
    let x;
    let y;
    let w;
    let h;
    if (side === "left") {
      if (role === "back") { // keeper, back, mid, attack
        x = 1000;
        w = 2000;
      } else if(role === "mid") {
        x = 3000;
        w = 4000;
      } else if(role === "attack") {
        x = 7000;
        w = 2000;
      } else {
        x = 0;
        w = 500;
        y = 3000;
        h = 500;
        return [new Rectangle(x,y,w,h)];
      }
    } else {
      if (role === "back") { // keeper, back, mid, attack
        x = 7000;
        w = 2000;
      } else if(role === "mid") {
        x = 3000;
        w = 4000;
      } else if(role === "attack") {
        x = 1000;
        w = 2000;
      } else {
        x = 9500;
        w = 500;
        y = 3000;
        h = 500;
        return [new Rectangle(x,y,w,h)];
      }
    }
    h = 6500 / count;
    let ret = [];
    for (let c = 0; c < count; c++) {
      ret[c] = new Rectangle(x,c*h,w,h);
    }
    return ret;
  }

  reposition(opponentTeam, ball) {
    for(let i = 0; i < this.players.length; i++) {
      this.players[i].reposition(this, opponentTeam, ball);
    }
  }

}
