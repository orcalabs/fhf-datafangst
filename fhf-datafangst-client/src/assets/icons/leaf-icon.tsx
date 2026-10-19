interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function LeafIcon({ fill = "currentColor", width = 48, height = 48 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 448 448"
      fill="none"
      aria-hidden="true"
    >
      {/* Main leaf silhouette and stem */}
      <path
        fill={fill}
        d="
          M360 28
          C337 59 311 74 280 84
          C240 97 195 103 153 118
          C103 136 72 164 61 202
          C54 225 57 250 69 294
          C109 255 161 228 216 204
          C270 180 315 150 336 111
          C320 157 291 186 248 211
          C201 239 148 264 110 301
          C79 331 52 365 28 391
          C26 395 29 401 34 405
          L53 418
          C59 422 63 418 66 411
          C81 382 96 358 111 343
          C144 364 184 368 224 361
          C292 348 345 302 373 237
          C400 173 394 99 360 28
          Z
        "
      />
    </svg>
  );
}

export default LeafIcon;
