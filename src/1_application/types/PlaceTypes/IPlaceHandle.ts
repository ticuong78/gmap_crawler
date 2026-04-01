export interface IPlaceHandle {
  getText(selector: string): Promise<string>;
  getAttribute(name: string): Promise<string>;
  findAll(selector: string): Promise<IPlaceHandle[]>;
}
