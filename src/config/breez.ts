import {
  connect, defaultConfig, ReceiveAmount
} from '@breeztech/breez-sdk-liquid/node';
import config from '../config/config';
import { Bolt11InvoiceResponse, SignMessageResponse } from '../interfaces';
import { ConflictError } from '../utils/errorHandler';


class BreezService {
    private sdk: any;
    private info: any;
    private currentLimit : any 
    constructor() {

    }

    async initiate() {
      try {
        let breeze_sdk_api = config.breez.breez_api_api;
        let breez_mnemonic = config.breez.breez_mnemonic;
        if(!breeze_sdk_api || !breez_mnemonic) {
          throw new ConflictError("Missing BREEZ_API_KEY or BREEZ_MNEMONIC in environment variables")
        }
        const breezConfig =  defaultConfig('regtest', breeze_sdk_api);
        this.sdk = await connect({ mnemonic: breez_mnemonic, config: breezConfig });
        // this.sdk.addEventListener(this.listener);

        this.info = await this.sdk.getInfo();

        console.log(`Breez SDK connected. pubkey of wallet is : ${this.info.walletInfo.pubkey}`);
        this.currentLimit = await this.sdk.fetchLightningLimits();
        console.log(`Minimum amount, in sats: ${this.currentLimit.receive.minSat}`);
        console.log(`Maximum amount, in sats: ${this.currentLimit.receive.maxSat}`);
      } catch (error) {
          console.error('Failed to initialize Breez SDK:', error);
          process.exit(1);
      }
    }

    async signMessge(message: string): Promise<SignMessageResponse> {
        const messageResponse = await this.sdk.signMessge({message});
        const info = await this.sdk.getInfo();

        const response : SignMessageResponse = {
          message: messageResponse,
          pubkey: info.pubkey,
          signature: info.signature,
        }

        return response
    }

    async verifySignature(message: string, pubkey: string, signature: string): Promise<{status:boolean}>{
      const verifySignature = await this.sdk.checkMessage({
        message,
        pubkey,
        signature
      })
      const isValid = verifySignature.isValid; 

      return  {status: isValid};
    }

    async getHealth() {
      this.info = await this.sdk.getInfo(); 
      return {
        status: 'Ok',
        message: 'connected With Breez SDK',
        wallet: this.info.walletInfo.pubkey,
        balance: this.info.walletInfo.balanceSat,
        pendingSats: this.info.walletInfo.pendingSendSat,
        pendingReceiveSats: this.info.walletInfo.pendingReceiveSat,
      };
    }

    async createBolt11Invoice(amountMsat: number, description: string): Promise<Bolt11InvoiceResponse> {
      if(amountMsat < this.currentLimit.receive.minSat || amountMsat > this.currentLimit.receive.maxSat ) {
        throw new ConflictError("Invoice Amount is out of Range")
      }

      const amountType: ReceiveAmount = {
        type: "bitcoin",
        payerAmountSat: amountMsat 
      };
      const prepareInvoiceResponse = this.sdk.prepareReceivePayment(
       {
         paymentMethod: "bolt11Invoice",
        amount: amountType
       }
      )

      const paymentInvoice = await this.sdk.receivePayment({
        prepareInvoiceResponse,
        description
      })
      const receiveFeesSat = prepareInvoiceResponse.feesSat;
      console.log(`Fees: ${receiveFeesSat} sats`)
      const swapperFee = prepareInvoiceResponse.swapperFee;
      const totalFee = swapperFee + receiveFeesSat;

      const invoiceResponse: Bolt11InvoiceResponse = {
        invoice: paymentInvoice,
        fee: totalFee
      }
      return invoiceResponse;
    }
}

export default new BreezService();