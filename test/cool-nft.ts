import {
    Client,
    Provider,
    ProviderRegistry,
    Result
} from "@blockstack/clarity";
import {
    assert
} from "chai";

const address1 = "SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9"
const key1 = "2bcfb132a17ec597975a7cb1efc80be5e409d7b3154ec0884ef8088f1ace1af201"
const address2 = "SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED"
const key2 = "8575f14c6e5d0e0bdaca0a895af7484b39ad596094b11cb5d6ca6ee4e74af89301"

describe("cool-nft contract test suite", () => {
    let contractClient: Client;
    let provider: Provider;
    before(async () => {
        provider = await ProviderRegistry.createProvider();
        contractClient = new Client(`${address1}.cool-nft`, "cool-nft", provider);
    });
    it("should have a valid syntax", async () => {
        await contractClient.checkContract();
    });
    const getOwner = async () => {
        const query = contractClient.createQuery({
            method: {
                name: "get-owner",
                args: ['u1']
            }
        });
        const receipt = await contractClient.submitQuery(query);
        console.log({
            receipt
        })
        const result = Result.unwrap(receipt);
        return result;
    }
    const execTransfer = async (tokenId, senderAddress, receiverAddress) => {
        const sender = `'${senderAddress}`
        const receiver = `'${receiverAddress}`
        const tx = contractClient.createTransaction({
            method: {
                name: "transfer",
                args: [tokenId, sender, receiver]
            }
        });
        await tx.sign(senderAddress);
        const receipt = await contractClient.submitTransaction(tx);
        console.log({
            receipt
        })
        const result = Result.unwrap(receipt);
        return result;
    }
    describe("deploying an instance of the contract", () => {
        before(async () => {
            await contractClient.deployContract();
        });
        it("last nft is 1", async () => {
            const getLastTokenId = async () => {
                const query = contractClient.createQuery({
                    method: {
                        name: "get-last-token-id",
                        args: []
                    }
                });
                const receipt = await contractClient.submitQuery(query);
                const result = Result.unwrapUInt(receipt);
                return result;
            }
            const result = await getLastTokenId();
            assert.equal(result, 1);
        })
        it("owner of 1 is me", async () => {
            const result = await getOwner();
            assert.equal(result, `(ok (some ${address1}))`);
        })
        it("can transfer original token", async () => {
            const result1 = await execTransfer('u1', address1, address2);
            console.log({
                result1
            })
            assert.equal(result1, 'Transaction executed and committed. Returned: true\n' +
                '[NFTEvent(NFTTransferEvent(NFTTransferEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, sender: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), recipient: Standard(StandardPrincipalData(SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED)), value: UInt(1) }))]');
            const result3 = await getOwner();
            assert.equal(result3, `(ok (some ${address2}))`);
        })
        it("can't transfer again", async () => {
            var failed = false
            try {
                const result8 = await execTransfer('u1', address1, address2);
                console.log({
                    result8
                })
            } catch (err) {
                console.log({
                    err
                })
                failed = true
            }
            assert.equal(failed, true)
        })
        it("can transfer back", async () => {
            const result1 = await execTransfer('u1', address2, address1);
            console.log({
                result1
            })
            assert.equal(result1, 'Transaction executed and committed. Returned: true\n' +
                '[NFTEvent(NFTTransferEvent(NFTTransferEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, sender: Standard(StandardPrincipalData(SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED)), recipient: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), value: UInt(1) }))]');
            const result3 = await getOwner();
            assert.equal(result3, `(ok (some ${address1}))`);
        })
        it("can claim new token", async () => {
            const execClaim = async () => {
                const tx = contractClient.createTransaction({
                    method: {
                        name: "claim",
                        args: ['u2']
                    }
                });
                await tx.sign(address1);
                const receipt = await contractClient.submitTransaction(tx);
                console.log({
                    receipt
                })
                const result = Result.unwrap(receipt);
                return result;
            }
            const result4 = await execClaim();
            console.log({
                result4
            })
            assert.equal(result4, 'Transaction executed and committed. Returned: true\n' +
    '[SmartContractEvent(SmartContractEventData { key: (QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, "print"), value: Bool(true) }), NFTEvent(NFTMintEvent(NFTMintEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, recipient: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), value: UInt(2) }))]');
            const result3 = await getOwner();
            assert.equal(result3, `(ok (some ${address1}))`);
        })
    });
    after(async () => {
        await provider.close();
    });
});
