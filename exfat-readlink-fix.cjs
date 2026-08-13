/**
 * Parche para compilar desde un disco externo en exFAT.
 *
 * El controlador de exFAT de Windows responde EISDIR a `readlink` sobre un
 * archivo normal, cuando lo correcto (y lo que hace NTFS) es EINVAL, o sea
 * "no es un enlace simbolico". Webpack no sabe interpretar EISDIR y aborta.
 *
 * Aqui se traduce ese unico caso: EISDIR -> EINVAL. No se toca nada mas.
 *
 * Se carga con --require, no desde next.config.ts, porque Next reparte la
 * compilacion entre procesos hijo y el parche tiene que existir en todos.
 */
const fs = require("node:fs");

const traducir = (error) => {
  if (error && error.code === "EISDIR") {
    error.code = "EINVAL";
    error.errno = -4071;
  }
  return error;
};

const readlinkSync = fs.readlinkSync;
fs.readlinkSync = function (...args) {
  try {
    return readlinkSync.apply(this, args);
  } catch (error) {
    throw traducir(error);
  }
};

const readlink = fs.readlink;
fs.readlink = function (ruta, opciones, callback) {
  const cb = typeof opciones === "function" ? opciones : callback;
  const envoltorio = (error, resultado) => cb(traducir(error), resultado);
  return typeof opciones === "function"
    ? readlink.call(this, ruta, envoltorio)
    : readlink.call(this, ruta, opciones, envoltorio);
};

const readlinkPromise = fs.promises.readlink;
fs.promises.readlink = function (...args) {
  return readlinkPromise.apply(this, args).catch((error) => {
    throw traducir(error);
  });
};
