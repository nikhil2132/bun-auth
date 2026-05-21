export class ApiResponse {
  constructor(statuscode, data, message = "Success") {
    this.statuscode = statuscode;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
