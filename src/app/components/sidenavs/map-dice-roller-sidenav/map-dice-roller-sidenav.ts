import { Component, signal } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { form, FormField, max, min, required, submit, validateTree } from '@angular/forms/signals';

@Component({
  selector: 'map-dice-roller-sidenav',
  imports: [MatDivider, MatButtonModule, MatInputModule, MatCheckboxModule, FormField],
  templateUrl: './map-dice-roller-sidenav.html',
  styleUrl: './map-dice-roller-sidenav.scss',
})
export class MapDiceRollerSidenav {
  private readonly MAX_ROLL_HISTORY_RECORDS : number = 20;

  public rollHistory : DiceRollHistory[];

  //Default values for the custom roll form
  customRollParams = signal({
    minimum: 1,
    maximum: 100,
    count: 1,
    useAverages: false
  });

  //Enforcement of form requirements
  customDiceRollForm = form(this.customRollParams, (schemaPath) => {
    required(schemaPath.minimum);
    required(schemaPath.maximum);
    required(schemaPath.count);

    //Field bounds enforcement
    min(schemaPath.minimum, 1, { message: 'Must be > 0' });
    min(schemaPath.maximum, 2, { message: 'Must be > 1' });
    min(schemaPath.count, 1, { message: 'Must be > 0' });

    max(schemaPath.minimum, 999, { message: 'Must be ≤ 999' });
    max(schemaPath.maximum, 1000, { message: 'Must be ≤ 1000' });
    max(schemaPath.count, 20, { message: 'Must be ≤ 20' });

    //Enforce maximum > minimum
    validateTree(schemaPath.maximum, (ctx) => {
      if (ctx.valueOf(schemaPath.maximum) <= ctx.valueOf(schemaPath.minimum)) {
        return {
          kind: 'min',
          message: 'Must be > low',
          fieldTree: ctx.fieldTree,
        };
      }
      return null;
    });
  });

  constructor() {
    this.rollHistory = [];
  }

  clearRollHistory() : void {
    this.rollHistory = [];
  }

  customRollDice() : void {
    submit(this.customDiceRollForm, async () => {
      this.quickRollDice(this.customRollParams().minimum, this.customRollParams().maximum, this.customRollParams().count, this.customRollParams().useAverages);
    });
  }

  quickRollDice(lowerBound: number, upperBound: number, numberOfRolls: number, useAverages: boolean) : void {
    let newRollHistory = new DiceRollHistory(lowerBound, upperBound, numberOfRolls, useAverages);
    this.rollHistory.unshift(newRollHistory);

    //If we've exceeded the roll history limit, pop the oldest record
    if(this.rollHistory.length > this.MAX_ROLL_HISTORY_RECORDS)
      this.rollHistory.pop();
  }
}

export class DiceRollHistory {
  public rolls : DiceRoll[];

  constructor(public lowerBound: number, public upperBound: number, public numberOfRolls: number, public useAveragedRolls: boolean) {
    this.rolls = [];
    for(let i = 0; i < this.numberOfRolls; i++) {
      this.rollDice();
    }
  }

  private rollDice() : void {
    let rolls = [];
    rolls.push(this.getRandomIntWithinBounds());

    //Roll twice if we're using averages
    if(this.useAveragedRolls) {
      rolls.push(this.getRandomIntWithinBounds());
    }

    this.rolls.push(new DiceRoll(rolls));
  }

  private getRandomIntWithinBounds() : number {
    return Math.floor(Math.random() * (this.upperBound - this.lowerBound + 1)) + this.lowerBound;
  }
}

export class DiceRoll { 
  constructor(public diceValues: number[]) {
  }

  calculateRollAverage() : number {
    if(this.diceValues.length < 1)
      return 0;

    let totalSum = this.diceValues.reduce((total, current) => total + current);
    return totalSum / this.diceValues.length;
  }
}
