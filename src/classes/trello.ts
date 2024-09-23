import axios, { AxiosInstance } from "axios";
import { trello as trelloConfig } from "../config";
import { Record } from "@prisma/client";
const { TRELLO_KEY, TRELLO_TOKEN } = process.env;

export interface Board {
  id: string;
  name: string;
}
export interface Card {
  id: string;
  name: string;
  shortUrl: string;
}
export interface Label {
  id: string;
  name: string;
}
class Trello {
  api: AxiosInstance;
  board: Board;
  labels: Array<Label>;
  mainListId: string;
  constructor({ listId }: { listId: string }) {
    this.api = axios.create({
      baseURL: `${trelloConfig.apiURL}`,
      params: {
        key: TRELLO_KEY,
        token: TRELLO_TOKEN,
      },
    });
    this.mainListId = listId;
  }

  getBoard = async (id: string): Promise<Board> => {
    try {
      const { data } = await this.api.get(`/boards/${id}`, {
        params: {
          fields: "name,desc,url,shortUrl",
        },
      });
      this.board = data;
      await this.getBoardLabels(id);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getBoardLabels = async (id: string): Promise<Label[]> => {
    try {
      const { data } = await this.api.get(`/boards/${id}/labels`, {
        params: {
          fields: "id,name",
        },
      });
      this.labels = data;
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  setListId = async (id: string) => {
    this.mainListId = id;
  };

  createCard = async (recordData: Record, listID?: string): Promise<Card> => {
    try {
      if (listID == undefined || listID == null) {
        listID = this.mainListId;
      }
      const { title, description, labels } = recordData;
      const { data } = await this.api.post(`/cards`, {
        name: title,
        desc: description,
        idList: listID,
        idLabels: labels,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  };
}

export { Trello };
