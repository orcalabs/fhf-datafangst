import init, * as fft from "assets/wasm/fft";
import { WeatherFftEntry } from "generated/openapi";
import { weatherLocationFeatures } from "./mapHelper";

const len = weatherLocationFeatures.length;

export async function rifft(coeffs: WeatherFftEntry[]): Promise<Float64Array> {
  return init().then((_) => fft.rifft(coeffs, len));
}
