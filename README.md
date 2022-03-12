# Lokian.eth: A trading card game dapp featuring NFT cards, share, fight and breed mythical creatures in solidity blockchains.

> Copyright belongs to [@tytzM17](https://github.com/tytzM17/Lokian.eth)


<!-- <img src="./screenshots/fighting_tab.png" alt="" width="1000em" height="500em">
 -->
 <img src="./screenshots/project.eth.ss2.png" alt="" width="1000em" height="500em">

***

This project was developed as a module coursework.

Thanks to Stamatis Kourkotas from

**Imperial College London:** MSc in Computing (Software Engineering)<br />
**Module:** Principless of Distributed Ledgers<br />
**Project Description:** Found in included [report](./report.pdf)<br />

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Steps for deployment and use of our DApp

- Firstly, deploy our smart contract found in src/project.eth.sol. We tested this locally on a private blockchain using [Ganache](https://www.trufflesuite.com/ganache)
- In the main file of our user interface src/App.tsx specify the address where you deployed the contract in the constant CONTRACT_ADDRESS.
- Install the [metamask](https://metamask.io/) extension on your browser to handle your provate blockchain account. The project has been tested with the Chrome and Mozilla browsers.
- In the project directory run:

    **`npm install`** This installs all the necessary dependencies to build our application
    
    **`npm start`** This runs the app in development mode.<br />

- Open [http://localhost:3000](http://localhost:3000) to view it in the browser. You can see all the Creatures owned by the current metamask account and play the game.

## Remaining Tasks

Finished
- Change naming e.g. cryptoMons to creatures 6/28/2021
- Change to 8bit theme for ui 07/02/2021
- Fix ui responsiveness and css, 07/14/2021
- Change creature names and artwork (mvp) 09/13/2021
- Convert frontend to typescript (mvp) 10/10/2021
- Fix wallet, use web3-react and injected connector (mvp) 10/10/2021
- Fix logo, create an 8 bit representation of the logo (mvp) 10/26/2021
- Create erc-1155 smart contract that will mint nfts, tests (mvp) 10/27/2021
- Create faucet page for getting nfts or tokens (mvp) 11/9/2021
- Breed then mint, pinJson, payable (mvp) 11/21/2021
- free packs are not nft not payable, basic to advance packs are nfts and payable (mvp) 11/29/2021
- breed mons are nft, payable (mvp) 11/29/2021
- Change contract to accept IERC20 e.g. USDT, instead of native token. For easy price maintenance. (mvp)  12/8/2021
- Create meme token functions (100 trillion, mvp) 12/8/2021
- Fight function extension, earn meme token when you win (mvp) 12/8/2021
- Record highscore function in game contract. 12/16/2021
- Removed memetoken and highscore functions
- Removed buyMon, addForSale, and removeFromSale functions
- Removed startSharing and stopSharing functions

Ongoing
- Remove stable coin as payment.
- Remove NFT pack buying
- NFT will have numbering on top right, NFT will have +1 attribute bonus on all fighting stats
- NFT integration and Token for highscore recording

- Test create, breed, nft, token functionalities (mvp)
- Deploy and test to evm compatible testnets (mvp)
- Deploy to evm compatible mainnets (mvp)

- Create frontend in namecheap or pinata if possible, (mvp)
- Create landing page in pinata/ipfs (mvp)
- Submit to dappradar, state of the dapps, etc (mvp)






