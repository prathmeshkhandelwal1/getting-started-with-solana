const {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const fs = require("fs");
import * as path from "path";

// const pathToMyKeypair = __dirname
const keypairFile = fs.readFileSync("wallet.json", "utf-8");
const secretKey = Buffer.from(JSON.parse(keypairFile.toString()));
const myKeyPair = Keypair.fromSecretKey(secretKey);

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(myKeyPair))
  .use(bundlrStorage({ address: "https://devnet.bundlr.network" }));

const uploadNFT = async () => {
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "First NFT",
  });

  const { nft } = await metaplex.nfts().create({
    uri: uri,
  });

  console.log(nft.mint.toBase58());
};

uploadNFT();
