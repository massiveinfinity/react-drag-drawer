"use strict";

exports.__esModule = true;
exports.isDirectionTop = isDirectionTop;
exports.isDirectionBottom = isDirectionBottom;
exports.isDirectionLeft = isDirectionLeft;
exports.isDirectionRight = isDirectionRight;
exports.isClientSide = isClientSide;
function isDirectionTop(direction) {
  return direction === "top";
}

function isDirectionBottom(direction) {
  return direction === "bottom";
}

function isDirectionLeft(direction) {
  return direction === "left";
}

function isDirectionRight(direction) {
  return direction === "right";
}

function isClientSide() {
  return typeof window !== "undefined";
}
