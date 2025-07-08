export interface SignMessageResponse {
  message: string,
  pubkey: string,
  signature: string,
}

export interface BoltInvoiceResponse {
  invoice: string,
  fee: number,
  qrUrl?: string
}