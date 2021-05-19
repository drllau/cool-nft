import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";

const sendAddress = "SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9"
const sendKey = "2bcfb132a17ec597975a7cb1efc80be5e409d7b3154ec0884ef8088f1ace1af201"
const recvAddress = "SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED"
const recvKey = "8575f14c6e5d0e0bdaca0a895af7484b39ad596094b11cb5d6ca6ee4e74af89301"

describe("cool-nft contract test suite", () => {
  let coolClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    coolClient = new Client(`${sendAddress}.cool-nft`, "cool-nft", provider);
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
		const sender = `'${sendAddress}`
		const receiver = `'${recvAddress}`
		console.log({sender})
      const tx = coolClient.createTransaction({
        method: { name: "transfer", args: ['u1', sender, receiver] }
      });
      await tx.sign(sendAddress);
      const receipt = await coolClient.submitTransaction(tx);
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
      await tx.sign(sendAddress);
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
      assert.equal(cool, `(ok (some ${sendAddress}))`);
    })
    it("can transfer", async () => {
      const cool = await getOwner();
      assert.equal(cool, `(ok (some ${sendAddress}))`);
      const cool1 = await execTransfer();
			console.log({cool1})
      assert.equal(cool1, 'Transaction executed and committed. Returned: true\n' +
    '[NFTEvent(NFTTransferEvent(NFTTransferEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, sender: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), recipient: Standard(StandardPrincipalData(SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED)), value: UInt(1) }))]');
      const cool3 = await getOwner();
      assert.equal(cool3, `(ok (some ${recvAddress}))`);
    })

  });
  after(async () => {
    await provider.close();
  });
});
