export function __keyBuffer__(key: string, byteLength: number) {
  const keyBuffer = Buffer.from(key, "utf8");
  return Buffer.concat([keyBuffer, Buffer.alloc(byteLength)], byteLength);
}
