export abstract class SlugServiceProtocol {
  abstract generateSlug(name: string, model: any): Promise<string>;
  abstract adjustSlug(
    oldName: string,
    newName: string | undefined,
    slug: string,
    model: any,
  ): Promise<string>;
}