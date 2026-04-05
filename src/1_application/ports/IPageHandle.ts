import { IElementHandle } from "./IElementHandle";

export interface IPageHandle {
  find(selector: string): Promise<IElementHandle>;
  findAll(selector: string): Promise<IElementHandle[]>;
}
