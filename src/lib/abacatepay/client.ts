import "server-only";
import AbacatePay from "abacatepay-nodejs-sdk";

let _client: ReturnType<typeof AbacatePay> | null = null;

export function getAbacateClient() {
  if (!_client) {
    const key = process.env.ABACATEPAY_API_KEY;
    if (!key) {
      throw new Error("ABACATEPAY_API_KEY não configurada.");
    }
    _client = AbacatePay(key);
  }
  return _client;
}
