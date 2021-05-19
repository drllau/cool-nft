import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
describe("cool-nft contract test suite", () => {
  let coolClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    coolClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.cool-nft", "cool-nft", provider);
  });
  it("should have a valid syntax", async () => {
    await coolClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getCounter = async () => {
      const query = coolClient.createQuery({
        method: { name: "get-counter", args: [] }
      });
      const receipt = await coolClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
    const execMethod = async (method: string) => {
      const tx = coolClient.createTransaction({
        method: {
          name: method,
          args: [],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await coolClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await coolClient.deployContract();
    });
    it("should start at zero", async () => {
      const cool = await getCounter();
      assert.equal(cool, 0);
    })
  });
  after(async () => {
    await provider.close();
  });
});
