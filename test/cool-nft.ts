import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
  function toHexString(input: String): String {
    return Buffer.from(input).toString('hex');
  };
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
    const getLastTokenId = async () => {
      const query = coolClient.createQuery({
        method: { name: "get-last-token-id", args: [] }
      });
      const receipt = await coolClient.submitQuery(query);
      const result = Result.unwrapUInt(receipt);
      return result;
    }
    const getOwner = async () => {
      const query = coolClient.createQuery({
        method: { name: "get-owner", args: ['u1'] }
      });
      const receipt = await coolClient.submitQuery(query);
			console.log({receipt})
      const result = Result.unwrap(receipt);
      return result;
    }
    const execTransfer = async () => {
		// const sender = `0x${toHexString('SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB')}`
		const sender = `SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB`
		console.log({sender})
      const query = coolClient.createQuery({
        method: { name: "transfer", args: ['u1', sender, sender] }
      });
      const receipt = await coolClient.submitQuery(query);
			console.log({receipt})
      const result = Result.unwrap(receipt);
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
    it("last nft is 1", async () => {
      const cool = await getLastTokenId();
      assert.equal(cool, 1);
    })
    it("owner of 1 is me", async () => {
      const cool = await getOwner();
      assert.equal(cool, '(ok (some SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB))');
    })
    it("can transfer", async () => {
      const cool = await execTransfer();
      assert.equal(cool, '(ok (some SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB))');
    })
  });
  after(async () => {
    await provider.close();
  });
});
