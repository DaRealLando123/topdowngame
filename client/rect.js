class Rect {
  constructor(x, y, z, dx, dy, dz, l, tex, i) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = dx;
    this.h = dy;
    this.d = dz;
    this.level = l;
    this.tex = tex;
    if(i === null){
      this.invis = 0;
    } else {
      this.invis = i;
    }

  }

  draw() {
    texture(textures[this.tex]);
    noStroke();
    if (level === this.level && dist(player[x],player[y],player[z],this.x,this.y,this.z) <= 32000 && this.invis != 1) {
      translate(this.x, this.y, this.z);
      box(this.w, this.h, this.d);
      translate(-this.x, -this.y, -this.z);
    }
  }

  checkCollision() {
    if(dist(this.x,this.y,this.z,player[x],player[y],player[z]) < (this.w + this.h + this.d) + 300){
    
    if ((player[x] + (playerSize / 2) + player[xvel]) > (this.x - (this.w / 2)) && (player[x] - (playerSize / 2) + player[xvel]) < (this.x + (this.w / 2))) {

      if ((player[z] + (playerSize / 2) + player[zvel]) > (this.z - (this.d / 2)) && (player[z] - (playerSize / 2) + player[zvel]) < (this.z + (this.d / 2))) {

        if ((player[y] + (player[yvel] + gravity)) >= (this.y - (this.h / 2)) && player[y] < this.y - (this.h / 2)) {

          if(crouching === 1 && player[yvel] > gravity*deltaTime*1.1){
            player[zvel] += -(Math.cos(camRotation) * (player[yvel])*1.0);
            player[xvel] += -(Math.sin(camRotation) * (player[yvel])*1.0);
          }

          player[y] = this.y - (this.h / 2) - gravity;
          player[yvel] = 0;
          canJump = jumps;
          onGround = 1;

        }

        if ((player[y] - (playerHeight - 5) + (player[yvel] + gravity)) <= (this.y + (this.h / 2)) && player[y] - (playerHeight - 5) > this.y + (this.h / 2)) {

          player[y] = this.y + (this.h / 2) - gravity + (playerHeight - 5);
          player[yvel] = 0;
          //canJump = 1;

        }

      }

    }

    if (player[y] > this.y - (this.h / 2) && player[y] - (playerHeight - 5) < this.y + (this.h / 2) - 1) {
      if ((player[z] + (playerSize / 2) + player[zvel]) > (this.z - (this.d / 2)) && (player[z] - (playerSize / 2) + player[zvel]) < (this.z + (this.d / 2))) {

        

        if (player[xvel] > 0) {

          if (player[x] + (playerSize / 2) - player[xvel] < (this.x - (this.w / 2))) {
            if (((player[x] + (playerSize / 2)) + player[xvel]) > (this.x - (this.w / 2)) && player[x] < this.x) {

              player[xvel] = 0;
              player[x] = (this.x - (this.w / 2)) - (playerSize / 2);
              //canJump = 1;

            }
          }

        }
        if (player[xvel] < 0) {

          if (player[x] >= (this.x + (this.w / 2) + (playerSize / 2))) {

            if (player[x] + (playerSize / 2) - player[xvel] > (this.x + (this.w / 2))) {
              if (((player[x] - (playerSize / 2)) + player[xvel]) < (this.x + (this.w / 2)) && player[x] > this.x) {

              player[xvel] = 0;
              player[x] = (this.x + (this.w / 2)) + (playerSize / 2);
              //canJump = 1;
              
              }
            }
          }
        }

      

      }
    }
    if (player[y] > this.y - (this.h / 2) && player[y] - (playerHeight - 5) < this.y + (this.h / 2) - 1) {
      if ((player[x] + (playerSize / 2) + player[xvel]) > (this.x - (this.w / 2)) && (player[x] - (playerSize / 2) + player[xvel]) < (this.x + (this.w / 2))) {

        if (player[zvel] > 0) {
          if (player[z] + (playerSize / 2) - player[zvel] < (this.z - (this.d / 2))) {
            if (((player[z] + (playerSize / 2)) + player[zvel]) > (this.z - (this.d / 2)) && player[z] < this.z) {

              player[zvel] = 0;
              player[z] = (this.z - (this.d / 2)) - (playerSize / 2);
              //canJump = 1;

            }
          }
        }
        if (player[zvel] < 0) {
          if (player[z] + (playerSize / 2) - player[zvel] > (this.z + (this.d / 2))) {
            if (((player[z] - (playerSize / 2)) + player[zvel]) < (this.z + (this.d / 2)) && player[z] > this.z) {

              player[zvel] = 0;
              player[z] = (this.z + (this.d / 2)) + (playerSize / 2);
              //canJump = 1;

            }
          }
        }
      }
    }
  }
  }
}