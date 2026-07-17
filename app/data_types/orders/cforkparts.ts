import { EaForksParts } from "./ea_forks_parts";

export default class CForkParts {
  private _fork_parts?: EaForksParts[];
  constructor(ea_fork_parts: EaForksParts[]) {
    this._fork_parts = ea_fork_parts;
  }

  public get fork_parts() {
    return this._fork_parts ?? [];
  }

  public addForkPart(part: EaForksParts) {
    this._fork_parts?.push(part);
  }

  public deleteForkPart(index: number) {
    this._fork_parts?.splice(index, 1);
  }

  public updateForkPart(part: EaForksParts) {
    const index = this._fork_parts?.findIndex(
      (p) => p.uid_forks_part === part.uid_forks_part,
    );
    if (index !== undefined && index !== -1) {
      this._fork_parts![index] = part;
    }
  }

  public getUidForksPart(index: number): number | undefined {
    return this._fork_parts?.at(index)?.uid_forks_part;
  }
}
