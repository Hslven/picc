'use strict';

import Base64 from 'crypto-js/enc-base64.js';
import Utf8 from 'crypto-js/enc-utf8.js';
import AES from 'crypto-js/aes.js';
import ECB from 'crypto-js/mode-ecb.js';
import Pkcs7 from 'crypto-js/pad-pkcs7.js';
import MD5 from 'crypto-js/md5.js';

class Encrypts {
    public md5(text: string): string {
        return MD5(text).toString();
    }

    public rsa(text: string): string {
        return 'rsa加密长度有限制，所以不用这个' + text;
    }

    public aes(text: string, key: string): string {
        key = key.substring(0, 16);
        const aesKey = Utf8.parse(key);
        const encrypted = AES.encrypt(text, aesKey, {
            mode: ECB,
            padding: Pkcs7,
        });
        return Base64.stringify(encrypted.ciphertext);
    }
}

export default new Encrypts();
