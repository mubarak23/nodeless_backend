export interface SignMessageResponse {
  message: string,
  pubkey: string,
  signature: string,
}

export interface Bolt11InvoiceResponse {
  invoice: string,
  fee: number,
  qrUrl?: string
}