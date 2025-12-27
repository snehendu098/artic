import { Address, PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";

export const initAccount = (pk: Address): PrivateKeyAccount => {
  return privateKeyToAccount(pk);
};
