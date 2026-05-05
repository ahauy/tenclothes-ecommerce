export interface IProductHistoryActor {
  fullName: string;
  role: string;
  email: string;
}

export interface IProductHistoryChange {
  from: unknown;
  to: unknown;
}

export interface IProductHistoryEntry {
  _id: string;
  productId: string;
  action: string;
  performedBy: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  actorInfo: IProductHistoryActor;
  changes: Record<string, IProductHistoryChange>;
  createdAt: string;
}

export interface IProductHistoryResponse {
  status: boolean;
  message: string;
  data: IProductHistoryEntry[];
}
