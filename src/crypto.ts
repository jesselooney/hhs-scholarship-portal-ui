import * as jose from 'jose';
import { PUBLIC_JWS_ALGORITHM, PUBLIC_JWS_SPKI_PEM } from '$env/static/public';

const algorithm = PUBLIC_JWS_ALGORITHM;
const spki = PUBLIC_JWS_SPKI_PEM;

export const publicKey = await jose.importSPKI(spki, algorithm);
