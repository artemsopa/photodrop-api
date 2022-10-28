export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  public static badRequest = (description: string) => new ApiError(400, `Bad Request. ${description}!`);
  public static unauthorized = (description: string) => new ApiError(401, `Unauthorized. ${description}!`);
}
