class ApiErrors extends Error {
  private status: string;

  constructor(message: string, private statusCode: number) {
    super(message);
    // code => 400,401,402,404   // failde => database and false url //  Error => Server
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "Error";
  }
}

export default ApiErrors;
