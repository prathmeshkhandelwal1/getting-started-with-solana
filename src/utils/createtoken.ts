import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getAccount,
  mintTo,
} from "@solana/spl-token";

const payer = Keypair.generate();
const mintAuthority = Keypair.generate();
const freezeAuthority = Keypair.generate();

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const createTokenUtil = async () => {
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(airdropSignature);

  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    freezeAuthority.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
  );

  console.log(mint.toBase58());

  const mintInfo = await getMint(connection, mint);
  console.log(`mint Info: ${mintInfo.supply}`);

  // creating token account to hold balance of tokens

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  console.log("token account address: " + tokenAccount.address.toBase58());

  const tokenAccountInfo = await getAccount(connection, tokenAccount.address);

  console.log("amount of tokens before minting :" + tokenAccountInfo.amount);

  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    100000000000 // because decimals for the mint are set to 9
  );

  const mintInfoAfter = await getMint(connection, mint);

  console.log("mint info after: " + mintInfoAfter.supply);
};

// const {
//   Metaplex,
//   keypairIdentity,
//   bundlrStorage,
// } = require("@metaplex-foundation/js");
// const {
//   Connection,
//   clusterApiUrl,
//   Keypair,
//   LAMPORTS_PER_SOL,
// } = require("@solana/web3.js");
// const fs = require("fs");
// import * as path from "path";

// const uploadNFT = async () => {
//   const wallet = Keypair.generate();
//   let connection = new Connection(clusterApiUrl("devnet"), "confirmed");

//   let airdropSignature = await connection.requestAirdrop(
//     wallet.publicKey,
//     LAMPORTS_PER_SOL
//   );

//   console.log(await connection.confirmTransaction(airdropSignature));
//   const metaplex = Metaplex.make(connection)
//     .use(keypairIdentity(wallet))
//     .use(bundlrStorage());

//   console.log(metaplex.nfts);
//   // const { uri } = await metaplex.nfts().uploadMetadata({
//   //   name: "Prathmesh NFT",
//   // });

//   const { nft } = await metaplex.nfts().create({
//     uri: "https://arweave.net/F7Yzv4NAu6YPdwwPfwRLXoBPsjYpg5hjz8TxVusL0go",
//   });

//   console.log(nft.mint.toBase58());
// };

// // console.log(path.join(__dirname, "../wallet.json"));

// uploadNFT();
