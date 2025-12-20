export interface CreateDelegationRequest {
  wallet: string;
}

export interface CreateDelegationData {
  userId: string;
  wallet: string;
  delegationId: string;
  delegationWalletPk: string;
}
