import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  missionArrived,
  missionFuel,
  missionGoal,
  missionMonths,
  planetBalance,
  planetStart,
  sortCorrect,
  sortItems,
} from './games.ts';

test('guardar todo el margen llena el depósito en la misión', () => {
  let fuel = 0;
  for (let month = 0; month < missionMonths; month += 1) fuel += missionFuel('save');
  assert.equal(fuel, 36);
  assert.equal(missionArrived(fuel), true);
  assert.ok(fuel > missionGoal);
});

test('gastar el margen no despega', () => {
  let fuel = 0;
  for (let month = 0; month < missionMonths; month += 1) fuel += missionFuel('spend');
  assert.equal(fuel, 0);
  assert.equal(missionArrived(fuel), false);
});

test('el clasificador distingue necesidad y deseo', () => {
  const rent = sortItems.find((item) => item.id === 'alquiler');
  const toy = sortItems.find((item) => item.id === 'juguete');
  assert.ok(rent && toy);
  assert.equal(sortCorrect(rent.kind, 'need'), true);
  assert.equal(sortCorrect(toy.kind, 'need'), false);
});

test('el planeta compuesto usa el tipo de ejemplo', () => {
  assert.equal(planetBalance(0, 0.1), planetStart);
  assert.ok(Math.abs(planetBalance(1, 0.1) - 110) < 1e-9);
  assert.ok(planetBalance(10, 0.1) > planetBalance(10, 0.02));
});
