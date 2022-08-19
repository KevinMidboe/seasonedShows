class Player {
   constructor(device, address) {
      this.device = device;
      this.ip = address;
      this.platform = undefined;
      this.product = undefined;
      this.title = undefined;
      this.state = undefined;
   }
}

module.exports = Player;
