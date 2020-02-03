import { a } from "../src/xx";

describe("AppController (e2e)", () => {
  beforeEach(async () => {
    console.log("before each");
  });

  it("/ (GET)", () => {
    console.log("test get");
    console.log("Hello");
    a();
  });
});
