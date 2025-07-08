import {
  connect, defaultConfig
} from '@breeztech/breez-sdk-liquid/node';
import config from '../config/config';
import { SignMessageResponse } from '../interfaces';
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
}

export default new BreezService();