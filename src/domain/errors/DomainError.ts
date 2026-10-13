export type PublishStatus = "draft" | "published";

export class DomainError extends Error {
  constructor(message: string, public readonly code: string = "DOMAIN_ERROR") {
    super(message);
    this.name = "DomainError";
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, identifier: string) {
    super(`${entity} with identifier "${identifier}" was not found.`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}
