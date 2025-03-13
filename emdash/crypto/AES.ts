import * as crypto from "node:crypto";
import { __keyBuffer__ } from "./__keyBuffer__";

const cfg = {
  algorithm: "aes-256-gcm",
  bytes: {
    iv: 12,
    key: 32,
    authTag: 16,
  },
} as const;

export const AES = {
  encrypt: (plaintext: string, key: string) => {
    const iv = crypto.randomBytes(cfg.bytes.iv);

    const cipher = crypto.createCipheriv(cfg.algorithm, __keyBuffer__(key, cfg.bytes.key), iv);

    return Buffer.concat([
      iv,
      cipher.update(plaintext),
      cipher.final(),
      cipher.getAuthTag(),
    ]).toString("base64");
  },
  decrypt: (encrypted: string, key: string) => {
    const ciphertext = Buffer.from(encrypted, "base64");

    const ivRange = [0, cfg.bytes.iv];
    const tagRange = [-cfg.bytes.authTag];
    const contentRange = [cfg.bytes.iv, -cfg.bytes.authTag];

    const iv = ciphertext.subarray(...ivRange);
    const tag = ciphertext.subarray(...tagRange);
    const content = ciphertext.subarray(...contentRange);

    const decipher = crypto.createDecipheriv(cfg.algorithm, __keyBuffer__(key, cfg.bytes.key), iv);

    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(content), decipher.final()]).toString("utf8");
  },
};
