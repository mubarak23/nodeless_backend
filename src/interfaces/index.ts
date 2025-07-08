export interface SignMessageResponse {
  message: string,
  pubkey: string,
  signature: string,
}

export interface BoltInvoiceResponse {
  destination: string,
  fee: number,
  qrUrl?: string
}

export interface OnChainResponse {
  destination: string,
  fee: number,
  qrUrl?: string
}