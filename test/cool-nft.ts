import {
    Client,
    Provider,
    ProviderRegistry,
    Result
} from "@blockstack/clarity";
import {
    assert
} from "chai";

const sendAddress = "SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9"
const sendKey = "2bcfb132a17ec597975a7cb1efc80be5e409d7b3154ec0884ef8088f1ace1af201"
const recvAddress = "SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED"
const recvKey = "8575f14c6e5d0e0bdaca0a895af7484b39ad596094b11cb5d6ca6ee4e74af89301"

describe("cool-nft contract test suite", () => {
    let contractClient: Client;
    let provider: Provider;
    before(async () => {
        provider = await ProviderRegistry.createProvider();
        contractClient = new Client(`${sendAddress}.cool-nft`, "cool-nft", provider);
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
    describe("deploying an instance of the contract", () => {
        const execTransfer = async () => {
            const sender = `'${sendAddress}`
            const receiver = `'${recvAddress}`
            console.log({
                sender
            })
            const tx = contractClient.createTransaction({
                method: {
                    name: "transfer",
                    args: ['u1', sender, receiver]
                }
            });
            await tx.sign(sendAddress);
            const receipt = await contractClient.submitTransaction(tx);
            console.log({
                receipt
            })
            const result = Result.unwrap(receipt);
            return result;
        }
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
            const cool = await getLastTokenId();
            assert.equal(cool, 1);
        })
        it("owner of 1 is me", async () => {
            const cool = await getOwner();
            assert.equal(cool, `(ok (some ${sendAddress}))`);
        })
        it("can transfer", async () => {
            const execTransfer = async () => {
                const sender = `'${sendAddress}`
                const receiver = `'${recvAddress}`
                console.log({
                    sender
                })
                const tx = contractClient.createTransaction({
                    method: {
                        name: "transfer",
                        args: ['u1', sender, receiver]
                    }
                });
                await tx.sign(sendAddress);
                const receipt = await contractClient.submitTransaction(tx);
                console.log({
                    receipt
                })
                const result = Result.unwrap(receipt);
                return result;
            }
            const cool1 = await execTransfer();
            console.log({
                cool1
            })
            assert.equal(cool1, 'Transaction executed and committed. Returned: true\n' +
                '[NFTEvent(NFTTransferEvent(NFTTransferEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, sender: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), recipient: Standard(StandardPrincipalData(SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED)), value: UInt(1) }))]');
            const cool3 = await getOwner();
            assert.equal(cool3, `(ok (some ${recvAddress}))`);
        })
        it("can't transfer again", async () => {
            const execTransfer = async () => {
                const sender = `'${sendAddress}`
                const receiver = `'${recvAddress}`
                console.log({
                    sender
                })
                const tx = contractClient.createTransaction({
                    method: {
                        name: "transfer",
                        args: ['u1', sender, receiver]
                    }
                });
                await tx.sign(sendAddress);
                const receipt = await contractClient.submitTransaction(tx);
                console.log({
                    receipt
                })
                const result = Result.unwrap(receipt);
                return result;
            }
						var failed = false
						try {
							const cool8 = await execTransfer();
							console.log({
									cool8
							})
						} 
						catch (err) {
							console.log({
									err
							})
							failed = true
						}
						assert.equal(failed, true)
        })
        it("can transfer back", async () => {
            const execTransfer = async () => {
                const receiver = `'${sendAddress}`
                const sender = `'${recvAddress}`
                console.log({
                    sender
                })
                const tx = contractClient.createTransaction({
                    method: {
                        name: "transfer",
                        args: ['u1', sender, receiver]
                    }
                });
                await tx.sign(recvAddress);
                const receipt = await contractClient.submitTransaction(tx);
                console.log({
                    receipt
                })
                const result = Result.unwrap(receipt);
                return result;
            }
            const cool1 = await execTransfer();
            console.log({
                cool1
            })
            assert.equal(cool1, 'Transaction executed and committed. Returned: true\n' +
                '[NFTEvent(NFTTransferEvent(NFTTransferEventData { asset_identifier: AssetIdentifier { contract_identifier: QualifiedContractIdentifier { issuer: StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9), name: ContractName("cool-nft") }, asset_name: ClarityName("cool-nft") }, sender: Standard(StandardPrincipalData(SPE6KGKEPW6QS8EXT9CAW40AHQ1PNB40K0J554ED)), recipient: Standard(StandardPrincipalData(SP4FZCYV4NQ6BGDT75S75H1W9D0SXMF39F2X21R9)), value: UInt(1) }))]');
            const cool3 = await getOwner();
            assert.equal(cool3, `(ok (some ${sendAddress}))`);
        })
        it("can claim", async () => {
            const execClaim = async () => {
                const sender = `'${sendAddress}`
                const receiver = `'${recvAddress}`
                console.log({
                    sender
                })
                const tx = contractClient.createTransaction({
                    method: {
                        name: "claim",
                        args: ['u2']
                    }
                });
                await tx.sign(sendAddress);
                const receipt = await contractClient.submitTransaction(tx);
                console.log({
                    receipt
                })
                const result = Result.unwrap(receipt);
                return result;
            }
            const cool1 = await execClaim();
            console.log({
                cool1
            })
        })
    });
    after(async () => {
        await provider.close();
    });
});
