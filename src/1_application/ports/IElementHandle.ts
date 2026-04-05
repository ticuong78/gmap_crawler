import { ScrollExecutionOptions } from "../options/ScrollExecutionOptions";

export interface IElementHandle {
  // Traversal
  find(selector: string): Promise<IElementHandle>;
  findAll(selector: string): Promise<IElementHandle[]>;

  // Interaction - Fluent
  click(): Promise<this>;
  type(text: string): Promise<this>;
  hover(): Promise<this>;
  scroll(options: ScrollExecutionOptions): Promise<this>;

  // Extraction
  getText(): Promise<string>;
  getAttribute(name: string): Promise<string>;
  getHTML(): Promise<string>;

  // Signs
  isVisible(): Promise<boolean>;
  isIntersectingViewport(): Promise<boolean>;
}
