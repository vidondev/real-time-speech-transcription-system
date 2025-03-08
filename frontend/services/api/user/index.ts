import { api } from "../api";
import { MessageListResponse, UserResponse } from "./types";

const create = async (params: { email: string; username: string }) => {
  return await api.fetcher<UserResponse>(
    {
      endpoint: `/login`,
    },
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
};

const messages = async () => {
  return await api.fetcher<MessageListResponse>({
    endpoint: `/messages`,
  });
};

export const user = {
  create,
  messages,
};
