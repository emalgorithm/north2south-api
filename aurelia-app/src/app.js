import {Checkpoint} from './checkpoint';

export class App {
  constructor() {
    this.heading = "Checkpoints";
    this.checkpoints = [];
    this.heartRate = 0;
    this.calories = 0;
    this.distance = 0;
  }

  addCheckpoint() {
    this.checkpoints.push(new Checkpoint(this.heartRate, this.calories, this.distance));
    this.heartRate = 0;
    this.calories = 0;
    this.distance = 0;
  }

  removeCheckpoint(checkpoint) {
    let index = this.checkpoints.indexOf(checkpoint);
    if (index !== -1) {
      this.checkpoints.splice(index, 1);
    }
  }
}
