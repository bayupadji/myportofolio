export class Slug {
  private readonly value: string;

  constructor(value: string) {
    const sanitized = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sanitized) {
      throw new Error("Slug cannot be empty");
    }
    this.value = sanitized;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
