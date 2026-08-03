#!/usr/bin/env node
// @ts-check

import { createCanvas, loadImage } from "canvas";
import { createWriteStream } from "node:fs";
import * as fs from "node:fs/promises";
import { argv, exit } from "node:process";

const version = argv[2];
if (!version) {
  // eslint-disable-next-line no-console
  console.error("Specify a version.");
  exit(1);
}

const ICONS_DIR = "public/species_icons";

await fs.rm(ICONS_DIR, { recursive: true, force: true });

const url = `https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?${version}`;
const sheet = await loadImage(url);

const NATIVE_ITEM_WIDTH = 40;
const NATIVE_ITEM_HEIGHT = 30;
const SCALE_MULT = 2;

const colsCount = sheet.width / NATIVE_ITEM_WIDTH;
const rowsCount = sheet.height / NATIVE_ITEM_HEIGHT;

await fs.mkdir(ICONS_DIR);

for (let i = 0; i < colsCount * rowsCount; i++) {
  const col = i % colsCount;
  const row = Math.floor(i / colsCount);

  const sx = col * NATIVE_ITEM_WIDTH;
  const sy = row * NATIVE_ITEM_HEIGHT;

  const canvas = createCanvas(NATIVE_ITEM_WIDTH * SCALE_MULT, NATIVE_ITEM_HEIGHT * SCALE_MULT);
  const context = canvas.getContext("2d");

  context.imageSmoothingEnabled = false;
  context.drawImage(
    sheet,
    sx,
    sy,
    NATIVE_ITEM_WIDTH,
    NATIVE_ITEM_HEIGHT,
    0,
    0,
    NATIVE_ITEM_WIDTH * SCALE_MULT,
    NATIVE_ITEM_HEIGHT * SCALE_MULT,
  );

  const png = canvas.createPNGStream();
  const write = createWriteStream(`${ICONS_DIR}/${i}.png`);

  png.pipe(write);
  await new Promise((ok) => write.on("finish", ok));
}

// eslint-disable-next-line no-console
console.log("Remember to upgrade the cache buster!")