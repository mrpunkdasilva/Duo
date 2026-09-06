export interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  photo?: string;
  createdAt: string;
  openAt: string;
  openedAt?: string;
  isOpened: boolean;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
}

export type TimeCapsuleStatus = "sealed" | "opened" | "ready";

export interface TimeCapsuleMonth {
  month: string;
  label: string;
  items: TimeCapsule[];
}
