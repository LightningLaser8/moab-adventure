class Booster extends Weapon {
  boostPower = 1;
  boostDuration = 1;
  trailDuration = 10;
  knockOthers = true;
  hasFireTrail = true;
  trailBullet = null;

  directions = 1;
  themeColour = [255, 128, 0];
  init() {
    super.init();
    delete this.shoot;
    delete this.recoil;
  }
  tick() {
    if (!this.slot) return;
    if (this.slot.entity) {
      this.x = this.slot.entity.x + this.slot.posX;
      this.y = this.slot.entity.y + this.slot.posY;
      if (this.rotate) {
        let d = this.slot.entity.velocity.angle;
        let dirInterval = 360 / this.directions;
        this.rotation = Math.round(d / dirInterval) * dirInterval;
      } else {
        this.rotation = this.slot.entity.direction;
      }
    }
    this.decelerate();
    if (this._cooldown > 0) {
      this._cooldown--;
    }
    this.parts.forEach((x) => x.tick()); //Tick all parts
  }
  fire() {
    if (this._cooldown <= 0) {
      SoundCTX.play(this.fireSound);
      this._cooldown = this.getAcceleratedReloadRate();
      this.accelerate(); //Apply acceleration effects

      Timer.main.repeat(
        () => {
          this.slot.entity.knock(this.boostPower, this.rotation, this.knockOthers);

          this.slot.entity.world.particles.push(
            new AfterImageParticle(
              this.slot.entity.x,
              this.slot.entity.y,
              this.slot.entity.directionRad,
              this.trailDuration,
              0,
              0,
              this.slot.entity.drawer.image,
              this.slot.entity.drawer.width ?? 1,
              this.slot.entity.drawer.width ?? 1,
              this.slot.entity.drawer.height ?? 1,
              this.slot.entity.drawer.height ?? 1,
              0,
              false
            )
          );
          if (this.hasFireTrail) {
            patternedBulletExpulsion(
              this.x,
              this.y,
              {
                type: "laser",
                length: this.boostPower / 2,
                hitSize: this.boostPower / 4,
                lifetime: 1,
                followsSource: true,
                status: "ignited",
                statusDuration: 180,
                damage: [
                  {
                    amount: 1,
                    type: "fire",
                  },
                ],
                drawer: {
                  shape: "ellipse",
                  fill: "orange",
                },
              },
              1,
              this.rotation + 180,
              0,
              0,
              this.slot.entity.world,
              this.slot.entity,
              this
            );
          }
          if (this.trailBullet) {
            patternedBulletExpulsion(
              this.x,
              this.y,
              this.trailBullet,
              1,
              this.rotation + 180,
              0,
              0,
              this.slot.entity.world,
              this.slot.entity,
              this
            );
          }
        },
        this.boostDuration,
        1
      );

      this.parts.forEach((x) => x.fire && x.fire()); //Tick all parts
    }
  }
}
