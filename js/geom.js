

class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(thatPoint) {
    let xDiv = Math.abs(this.x - thatPoint.x);
    let yDiv = Math.abs(this.y - thatPoint.y);
    return Math.sqrt((xDiv*xDiv) + (yDiv*yDiv))
  }

  moveTo(direction, distance) {
    let ndir = direction % 360;
    if (ndir === 0) {
      this.y = this.y - distance;
    } else if (ndir === 90) {
      this.x = this.x + distance;
    } else if (ndir === 180) {
      this.y = this.y + distance;
    } else if (ndir === 270) {
      this.x = this.x - distance;
    } else if (ndir > 0 && ndir < 90) {
      let rad = degreeToRadian(ndir);
      let ay = Math.floor(Math.cos(rad) * distance); // opp
      let ax = Math.floor(Math.sin(rad) * distance); // add
      this.x = this.x + ax;
      this.y = this.y - ay;
    } else if (ndir > 90 && ndir < 180) {
      let rad = degreeToRadian(ndir-90);
      let ax = Math.floor(Math.cos(rad) * distance);
      let ay = Math.floor(Math.sin(rad) * distance);
      this.x = this.x + ax;
      this.y = this.y + ay;
    } else if (ndir > 180 && ndir < 270) {
      let rad = degreeToRadian(ndir-180);
      let ay = Math.floor(Math.cos(rad) * distance); // opp
      let ax = Math.floor(Math.sin(rad) * distance); // adj
      this.x = this.x - ax;
      this.y = this.y + ay;
    } else  {
      let rad = degreeToRadian(ndir-270);
      let ax = Math.floor(Math.cos(rad) * distance);
      let ay = Math.floor(Math.sin(rad) * distance);
      this.x = this.x - ax;
      this.y = this.y - ay;
    }
  }

  headingTo(thatPoint) {
    if (this.x === thatPoint.x) {
      if (this.y >= thatPoint.y) {
        return 0; // N
      }
      return 180; // S
    } else if (this.y === thatPoint.y) {
      if (this.x <= thatPoint.x) {
        return 90; // E
      }
      return 270;  // W
    } else if (this.x < thatPoint.x) {
      if (this.y > thatPoint.y) {
        // NE
        let adjacent = this.y - thatPoint.y;
        let opposite = thatPoint.x - this.x;
        return radianToDegree(Math.atan(opposite/adjacent));
      }
      // SE
      let adjacent = thatPoint.x - this.x;
      let opposite = thatPoint.y - this.y;
      return radianToDegree(Math.atan(opposite/adjacent)) + 90;
    }
    if (this.y > thatPoint.y) {
      // NE
      let opposite = this.y - thatPoint.y;
      let adjacent = this.x - thatPoint.x;
      return radianToDegree(Math.atan(opposite/adjacent)) + 270;
    }
    // SW
    let adjacent = thatPoint.y - this.y;
    let opposite = this.x - thatPoint.x;
    return radianToDegree(Math.atan(opposite/adjacent)) + 180;
  }


}

function radianToDegree(rad) {
  let pi = Math.PI;
  return Math.floor(rad * (180/pi));
}

function degreeToRadian(deg) {
  let pi = Math.PI;
  return deg * (pi/180);
}

class Rectangle {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  getRandomPointWithin() {
    return new Point(this.x + Math.floor(Math.random() * this.w), this.y + Math.floor(Math.random() * this.h));
  }

  isContainPoint(point) {
    return point.x >= this.x && point.y >= this.y && point.x <= this.x + this.w && point.y <= this.y + this.h;
  }
}

class Line {
  constructor(x1,y1,x2,y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  midPoint() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }

  isIntersects(thatLine) {
    let a = this.x1;
    let b = this.y1;
    let c = this.x2;
    let d = this.y2;
    let p = thatLine.x1;
    let q = thatLine.y2;
    let r = thatLine.x2;
    let s = thatLine.y2;
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };
}
