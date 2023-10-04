/* tslint:disable */
/* eslint-disable */
/**
 * @param {any[]} coefficients
 * @param {number} len
 * @returns {Float64Array}
 */
export function rifft(coefficients: any[], len: number): Float64Array;
/**
 */
export class FftEntry {
  free(): void;
  /**
   */
  idx: number;
  /**
   */
  im: number;
  /**
   */
  re: number;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fftentry_free: (a: number) => void;
  readonly __wbg_get_fftentry_idx: (a: number) => number;
  readonly __wbg_set_fftentry_idx: (a: number, b: number) => void;
  readonly __wbg_get_fftentry_re: (a: number) => number;
  readonly __wbg_set_fftentry_re: (a: number, b: number) => void;
  readonly __wbg_get_fftentry_im: (a: number) => number;
  readonly __wbg_set_fftentry_im: (a: number, b: number) => void;
  readonly rifft: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initSync(module: SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?: InitInput | Promise<InitInput>,
): Promise<InitOutput>;
