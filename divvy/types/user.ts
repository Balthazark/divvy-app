export type UserMetaData = {
  name: string;
  lastName: string;
  email: string;
  color: string;
  friends: string[];
  friendsRequests: string[];
};

export type Friend = {
  email: string;
  userId: string;
  name: string;
  lastName: string;
};
