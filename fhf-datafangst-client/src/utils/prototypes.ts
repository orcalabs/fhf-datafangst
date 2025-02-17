export {};

declare global {
  interface Array<T> {
    sum(callback?: (value: T) => number): number;
    last(): T | undefined;
  }

  interface String {
    splitOnce(separator: string): [string, string] | undefined;
  }
}

if (!(Array.prototype as any).sum)
  Object.defineProperty(Array.prototype, "sum", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function <T>(callback?: (value: T) => number): number {
      let result = 0;
      if (callback)
        for (let i = 0; i < this.length; i++) {
          result += callback(this[i]);
        }
      else
        for (let i = 0; i < this.length; i++) {
          result += this[i] as number;
        }
      return result;
    },
  });

if (!(Array.prototype as any).last)
  Object.defineProperty(Array.prototype, "last", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function <T>(): T | undefined {
      return this[this.length - 1];
    },
  });

if (!(String.prototype as any).splitOnce)
  Object.defineProperty(String.prototype, "splitOnce", {
    enumerable: false,
    writable: false,
    configurable: false,
    value: function (separator: string): [string, string] | undefined {
      const idx = this.indexOf(separator);
      return idx >= 0
        ? [this.substring(0, idx), this.substring(idx + separator.length)]
        : undefined;
    },
  });
