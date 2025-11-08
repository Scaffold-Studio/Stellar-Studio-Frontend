/**
 * Contract Helpers
 *
 * Utility functions for working with Stellar Soroban contract values
 */

import { xdr } from '@stellar/stellar-sdk';

/**
 * Helper to convert ScVal to JavaScript value
 *
 * Converts Soroban contract ScVal types to JavaScript primitives.
 * Used by client wrappers to parse contract return values.
 */
export function scValToJs(value: xdr.ScVal): any {
  switch (value.switch()) {
    case xdr.ScValType.scvBool():
      return value.b();
    case xdr.ScValType.scvU32():
      return value.u32();
    case xdr.ScValType.scvI32():
      return value.i32();
    case xdr.ScValType.scvU64():
      return value.u64().toString();
    case xdr.ScValType.scvI64():
      return value.i64().toString();
    case xdr.ScValType.scvU128():
      return value.u128().toString();
    case xdr.ScValType.scvI128():
      return value.i128().toString();
    case xdr.ScValType.scvString():
      return value.str().toString();
    case xdr.ScValType.scvAddress():
      return value.address().toString();
    case xdr.ScValType.scvBytes():
      return Buffer.from(value.bytes()).toString('hex');
    case xdr.ScValType.scvVec():
      return value.vec()?.map(v => scValToJs(v)) || [];
    case xdr.ScValType.scvMap():
      const map: Record<string, any> = {};
      value.map()?.forEach(entry => {
        const key = scValToJs(entry.key());
        const val = scValToJs(entry.val());
        map[String(key)] = val;
      });
      return map;
    default:
      return value.toString();
  }
}
