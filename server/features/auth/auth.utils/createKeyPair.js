import crypto from 'crypto';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = import.meta.dirname;

function genKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE.toString()
        }
    });

    fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);

    fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
};

genKeyPair();