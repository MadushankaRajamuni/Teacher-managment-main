import { Injectable } from '@angular/core';
import {SETTINGS} from '../config/common.settings';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encrypt(field: any): string {
    return CryptoJS.AES.encrypt(field, SETTINGS.KEYS.SECRET).toString();
  }

  decrypt(cypherStr: any): string {
    const bytes = CryptoJS.AES.decrypt(
      cypherStr.toString(),
      SETTINGS.KEYS.SECRET,
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
