import React, { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tab, Tabs } from 'react-bootstrap'
import StatBar from './StatBar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Spinner } from './components/Spinner'

// Library to work with Ethereum like blockchain
import { injected } from './wallet/connectors'
import { useEagerConnect, useInactiveListener } from './wallet/hooks'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { WeiPerEther } from '@ethersproject/constants'
import { formatUnits, parseEther } from '@ethersproject/units'

// abis
import contrInterface from './abi.json' // Load contract json file
// import erc1155Interface from './erc1155Interface.json'
// import erc1155Interface from './project.nft.abi.json'

// Load all the background images for the 10 different Cryptomon types
import bg0 from './sprites/background/0.png'
import bg1 from './sprites/background/1.png'
import bg2 from './sprites/background/2.png'
import bg3 from './sprites/background/3.png'
import bg4 from './sprites/background/4.png'
import bg5 from './sprites/background/5.png'
import bg6 from './sprites/background/6.png'
import bg7 from './sprites/background/7.png'
import bg8 from './sprites/background/8.png'
import bg9 from './sprites/background/9.png'
import bg10 from './sprites/background/10.png'

// axios
import axios, { AxiosResponse } from 'axios'
// import { pinJSONToIPFS } from './rest/pinJSONToIPFS'

// util
// import cryptoRandom from './utils/cryptoRandom'
import { Web3Provider } from '@ethersproject/providers'
import txSuccess from './utils/txSuccess'
import txFail from './utils/txFail'

enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
}

// Contact deployment address
const CONTRACT_ADDRESS = '0x4DaBC26F9CEf30baE4a7915db4713c66e16DA5f0'

// nft contract, feb 2022, 0x21e3d6d2a0b848F8C1F4cA18511498cA4952D370
// const ERC1155_CONTRACT_ADDRESS = '0x21e3d6d2a0b848F8C1F4cA18511498cA4952D370'

// erc20 stable coin address = 0x962c22c4aaB626d4C864c1FC6633138C2969ba66, feb 2022
// const ERC20_CONTRACT_ADDRESS = '0x962c22c4aaB626d4C864c1FC6633138C2969ba66'

// Add background images in an array for easy access
const bg = [bg0, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10]

// Add all 151 Cryptomon names in an array
const names = [
  'Dryad',
  'Hamadryad',
  'Leshy',
  'Santelmo',
  'Cerberus',
  'Efreet',
  'Fastitocalon',
  'Aspidochelone',
  'Zaratan',
  'Arachne',
  'Jorogumo',
  'Tsuchigumo',
  'Pabilsag',
  'Girtablilu',
  'Selket',
  'Tsikavats',
  'Munnin',
  'Huginn',
  'Azeban',
  'Ratatoskr',
  'Stratim',
  'Navka',
  'Apep',
  'Nidhoggr',
  'Raiju',
  'Raijin',
  'Amphivena',
  'Basilisk',
  'Wolpertinger',
  'Ramidreju',
  'Echinemon',
  'Mujina',
  'Kamaitachi',
  'Lavellan',
  'Vila',
  'Huldra',
  'Chimera',
  'Kyuubi',
  'Nixie',
  'Tuathan',
  'Minyades',
  'Camazotz',
  'Curupira',
  'Penghou',
  'Ghillie_Dhu',
  'Myrmecoleon',
  'Myrmidon',
  'Mothman',
  'Moth_King',
  'Grootslang',
  'Yaoguai',
  'Cait_Sidhe',
  'Cath_Balug',
  'Nakki',
  'Kappa',
  'Satori',
  'Shojo',
  //'Skohl',
  'Haet',
  'Vodyanoy',
  'Undine',
  'Melusine',
  'Vukodlak',
  'Chernobog',
  'Djinn',
  'Bauk',
  'Troll',
  'Jotun',
  'Spriggan',
  'Jubokko',
  'Kodama',
  'Bukavak',
  'Kraken',
  'Clayboy',
  'Met',
  'Emet',
  'Sleipnir',
  'Todorats',
  'Scylla',
  'Charybdis',
  'Brontes',
  'Arges',
  'Hraesvelgr',
  'Berunda',
  'Cockatrice',
  'Selkie',
  'Rusalka',
  'Tarasque',
  'Meretseger',
  'Carbuncle',
  'Shen',
  'Boogeyman',
  'Banshee',
  'Mare',
  'Dilong',
  'Incubus',
  'Succubus',
  'Cancer',
  'Karkinos',
  'Druk',
  'Shenlong',
  'Gan_Ceann',
  'Oni',
  'Tairanohone',
  'Gashadokuro',
  'Yeren',
  'Yeti',
  'Yowie',
  'Nezhit',
  'Chuma',
  'Sigbin',
  'Gargoyle',
  'Caladrius',
  'Umibozu',
  'Callisto',
  'Kelpie',
  'Makara',
  'Morgen',
  'Merrow',
  'Naiad',
  'Nereid',
  'Pixiu',
  'Khepri',
  'Likho',
  'kitsune',
  'Caorthannach',
  'Kaggen',
  'Audumbla',
  'Lochness',
  'Jormungandr',
  'Leviathan',
  'Doppelganger',
  'Skvader',
  'Fossegrim',
  'Valkyrie',
  'Basan',
  'Tsukumogami',
  'Luska',
  'Hydra',
  'Afanc',
  'Cetus',
  'Vedfolnir',
  'Baku',
  'Alkonost',
  'Quetzalcoatl',
  'Anzu',
  'Zmey',
  'Azhdaya',
  'Fafnir',
  'Baba_Yaga',
  'Baba_Roga',
]

async function getMons(_library, _account) {
  const contr = new Contract(CONTRACT_ADDRESS, contrInterface, _library.getSigner(_account))
  const totalMons = parseInt(await contr.totalMons())
  return Promise.all([...Array(totalMons).keys()].map((id) => contr.mons(id)))
}

function Account() {
  const { account } = useWeb3React()

  return (
    <span>
      {account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
    </span>
  )
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

function App() {
  const [cryptomons, setCryptomons] = useState([])
  const [myCryptomons, setMyCryptomons] = useState([])
  const [otherCryptomons, setOtherCryptomons] = useState([])
  const [value, setValue] = useState(0) // Used in My Cryptomons tab for input in price text
  // Used in breeding tab
  const [breedChoice1, setBreedChoice1] = useState(null)
  const [breedChoice2, setBreedChoice2] = useState(null)
  // Used in fighting tab
  const [fightChoice1, setFightChoice1] = useState(null)
  const [fightChoice2, setFightChoice2] = useState(null)
  const [winner, setWinner] = useState(null) // Used to display winner of the last fight
  const [rounds, setRounds] = useState(null) // Used to display number of rounds the fight lasted
  const [shareId, setShareId] = useState('') // Used in shareId form input field
  const [shareAddress, setShareAddress] = useState('') // Used in shareAddress form input field
  // const [chosenPack, setChosenPack] = useState('freePack')
  const [coinData, setCoinData] = useState<AxiosResponse | null>(null)
  // const [breedMintInfo, setBreedMintInfo] = useState(null)

  const context = useWeb3React<Web3Provider>()
  const { connector, account, library, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }

    refreshMons()
  }, [activatingConnector, connector])

  // Get network coin price e.g. eth or glmr price
  useEffect(() => {
    const eth = 'ethereum'
    const aca = 'acala'
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${eth}`
    let unmounted = false
    let source = axios.CancelToken.source()

    axios
      .get(url, {
        cancelToken: source.token,
      })
      .then((res) => {
        if (!unmounted) {
          // @ts-ignore
          setCoinData(res.data)
        }
      })
      .catch(function (e) {
        if (!unmounted) {
          toast.error(`Error: ${e.message}`)
        }
        if (axios.isCancel(e)) {
          console.log(`request cancelled:${e.message}`)
        } else {
          console.log('another error happened:' + e.message)
        }
      })

    return () => {
      unmounted = true
      source.cancel('Cancelling in cleanup')
    }
  }, [])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  // Change the list of created Crypromons saved in the state so UI refreshes after this call
  async function refreshMons() {
    if (!library || !account) return
    await getMons(library, account)
      .then((_mons) => {
        // map result
        const monsMap = _mons.map((mon) => ({
          atk: mon.atk,
          def: mon.def,
          evolve: mon.evolve,
          forSale: mon.forSale,
          hp: mon.hp,
          id: BigNumber.from(mon.id._hex).toNumber(),
          monType: mon.monType,
          owner: mon.owner,
          price: BigNumber.from(mon.price._hex).toBigInt(),
          sharedTo: mon.sharedTo,
          species: mon.species,
          speed: mon.speed,
        }))
        setCryptomons(monsMap)
        setMyCryptomons(monsMap.filter((mon) => mon.owner === account))
        setOtherCryptomons(monsMap.filter((mon) => mon.owner !== account))
      })
      .catch((err) => toast.error(err))
  }

  // Function that buys a Cryptomon through a smart contract function
  async function buyMon(id, price) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    // const weiPerEth = WeiPerEther as any
    const newprice = `${BigInt(price)}`
    // const newPrice =  BigNumber.from(parseEther(price)).toString();
    let overrides = { value: newprice }
    console.log(overrides);
    
    const tx = await contr.buyMon(id, overrides)
    const recpt = await tx.wait()
    txSuccess(recpt, toast, refreshMons)
    txFail(recpt, toast)
  }

  // Function that adds a Cryptomon for sale through a smart contract function
  async function addForSale(id, price) {
    if (price === 0 || price === '0') {
      toast.error('🦄 Price is 0')
      return
    }
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    // const tx = await contr.addForSale(id, `${BigInt(price * (WeiPerEther as any))}`)
    const tx = await contr.addForSale(id, parseEther(price))
    const receipt = await tx.wait()
    if (receipt && receipt.status === 1) {
      toast.success(`Success, Tx hash: ${receipt.transactionHash}`)
      refreshMons()
    }

    if (receipt && receipt.status === 0) {
      toast.error(`Error, Tx hash: ${receipt.transactionHash}`)
    }
  }

  // Function that removes a Cryptomon from sale through a smart contract function
  async function removeFromSale(id) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.removeFromSale(id)
    const recpt = await tx.wait()
    if (recpt && recpt.status === 1) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
    }

    if (recpt && recpt.status === 0) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
    }
  }

  // Function that breeds 2 Cryptomons through a smart contract function
  async function breedMons(id1, id2) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.breedMons(id1, id2)
    const recpt = await tx.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
    }

    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
    }

    await refreshMons()
  }

  // Function that allows 2 Cryptomons to fight through a smart contract function
  async function fight(id1, id2) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const res = await contr.functions.fight(id1, id2)
    if (res && res.length) {
      const winner = BigNumber.from(res[0]._hex).toNumber()
      setWinner(winner)
      setRounds(res[1])
      refreshMons()
    }

    if (!res || !res.length) {
      toast.error(`Error, Tx hash: ${res.transactionHash}`)
    }
  }

  // Function that starts sharing a Cryptomon to another address through a smart contract function
  async function startSharing(id, address) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.startSharing(id, address)
    const recpt = await tx.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
    }

    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
    }
  }

  // Function that stops sharing a Cryptomon with other addresses through a smart contrct function
  async function stopSharing(id) {
    const contr = new Contract(CONTRACT_ADDRESS, contrInterface, library.getSigner(account))
    const tx = await contr.stopSharing(id)
    const recpt = await tx.wait()
    if (recpt && recpt.status) {
      toast.success(`Success, Tx hash: ${recpt.transactionHash}`)
      refreshMons()
    }

    if (recpt && !recpt.status) {
      toast.error(`Error, Tx hash: ${recpt.transactionHash}`)
    }
  }

  // Handlers for form inputs
  function handleShareId(event) {
    setShareId(event.target.value)
  }
  function handleShareAddress(event) {
    setShareAddress(event.target.value)
  }

  function handleChange(id, event) {
    setValue(event.target.value)
  }

  // Components
  // div that holds the name and id of each Cryptomon
  const nameDiv = (mon) => {
    return (
      <div>
        <label className="monName">{names[mon?.species]}</label>
        <label className="" style={{ float: 'right' }}>
          {'ID: ' + mon?.id}
        </label>
      </div>
    )
  }

  // Function that  returns the style of the background image according to Cryptomons' type
  const bgStyle = (Type) => ({
    backgroundImage: 'url(' + bg[Type] + ')',
    backgroundSize: '210px 240px',
  })

  // div that holds the images (Cryptomon image and background image) of a Cryptomon
  const imgDiv = (mon) => {
    return (
      <div className="monBox" style={bgStyle(mon?.monType)}>
        <img
          className="monImg"
          src={require('./sprites/' + (parseInt(mon?.species) + 1) + '.png')}
          alt={mon?.species}
        />
      </div>
    )
  }

  // div that holds the stats of a Cryptomon
  const statDiv = (mon) => {
    return (
      <div className="stat-area">
        <div className="stat-line">
          <label className="stat-label">Hp: </label>
          <StatBar percentage={(mon?.hp * 100) / 140} />
        </div>
        <div className="stat-line">
          <label className="stat-label">Attack: </label>
          <StatBar percentage={(mon?.atk * 100) / 140} />
        </div>
        <div className="stat-line">
          <label className="stat-label">Defense: </label>
          <StatBar percentage={(mon?.def * 100) / 140} />
        </div>
        <div className="stat-line">
          <label className="stat-label">Speed: </label>
          <StatBar percentage={(mon?.speed * 100) / 140} />
        </div>
      </div>
    )
  }

  // Create the div with add for sale button
  const addForSaleDiv = (mon, value) => {
    return (
      <div className="selling-div">
        <label className="add-for-sale-label">Set creatures price:</label>
        <input type="number" className="add-for-sale-input" value={value} onChange={(e) => handleChange(mon?.id, e)} />
        <button
          className="rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => addForSale(mon?.id, value)}
        >
          Add for sale
        </button>
      </div>
    )
  }

  // Create the div with remove from sale button
  const removeFromSaleDiv = (mon) => {
    return (
      <div className="selling-div">
        <label className="remove-from-sale-label">
          Price:
          <br />
          {formatUnits(mon?.price)}
        </label>
        <button
          className="rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => removeFromSale(mon?.id)}
        >
          Remove from sale
        </button>
      </div>
    )
  }

  // Create the div with buy button
  const buyDiv = (mon) => {
    return (
      <div className="buying-div">
        <div className="sale-price">
          Price:
          <br />
          {formatUnits(mon?.price, 18)}
        </div>
        <div className="sale-owner">Creature Owner: {mon?.owner} </div>
        <button
          className="sale-btn rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => buyMon(mon?.id, mon?.price)}
        >
          Buy
        </button>
      </div>
    )
  }

  // Create the div with breed choice 1, choice 2 buttons
  const breedDiv = (mon) => {
    return (
      <div className="breed-choice-div">
        <button
          className="br-Choice-btn rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => {
            setBreedChoice1(mon?.id)
          }}
        >
          Choice 1
        </button>
        <button
          className="br-Choice-btn rpgui-button"
          type="button"
          style={{ float: 'right' }}
          onClick={() => {
            setBreedChoice2(mon?.id)
          }}
        >
          Choice 2
        </button>
      </div>
    )
  }

  const breedOption = (breedchoice) => {
    if (breedchoice === null) {
      return (
        <div className="mon">
          <figure className="my-figure">
            <figcaption>
              <div className="monBox">
                {' '}
                <img className="monImg" src={require('./sprites/0.png')} alt={'empty'} />
              </div>
            </figcaption>
          </figure>
        </div>
      )
    } else {
      return cryptomons
        .filter((mon) => mon.id === breedchoice)
        .map((mon) => (
          <React.Fragment key={mon.id}>
            <div className="mon">
              <figure className="my-figure">
                {imgDiv(mon)}
                <figcaption></figcaption>
              </figure>
            </div>
          </React.Fragment>
        ))
    }
  }

  // div with users Cryptomons
  const myCryptomonsDiv = myCryptomons
    .filter((mon) => !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {addForSaleDiv(mon, value)}
        </div>
      </React.Fragment>
    ))

  // div with user's Cryptomons that are for sale
  const forSaleCryptomons = myCryptomons
    .filter((mon) => mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {removeFromSaleDiv(mon)}
        </div>
      </React.Fragment>
    ))

  // div with Cryptomons available for buy to the user
  const buyCryptomons = otherCryptomons
    .filter((mon) => mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {buyDiv(mon)}
        </div>
      </React.Fragment>
    ))

  // div with user's Cryptomons that can be used for breeding
  const forBreedCryptomons = myCryptomons
    .filter((mon) => !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          {breedDiv(mon)}
        </div>
      </React.Fragment>
    ))

  const cond = (mon) =>
    mon.owner.toString().toLowerCase() === account?.toString()?.toLowerCase() ||
    (mon.sharedTo.toString().toLowerCase() === account?.toString()?.toLowerCase() &&
    mon.owner?.toString().toLowerCase() !== account?.toString()?.toLowerCase())

  // div with user's Cryptomons that can be used to fight with
  const forFightWithCryptomons = cryptomons.filter(cond).map((mon) => (
    <React.Fragment key={mon.id}>
      <div className="mon">
        <figure className="my-figure">
          {nameDiv(mon)}
          {imgDiv(mon)}
          <figcaption>{statDiv(mon)}</figcaption>
        </figure>
        <div className="fight-choice-div">
          <button
            className="fight-Choice-btn rpgui-button"
            type="button"
            style={{ float: 'right' }}
            onClick={() => {
              setFightChoice1(mon.id)
            }}
          >
            Choice 1
          </button>
        </div>
      </div>
    </React.Fragment>
  ))

  // div with Cryptomons that user can fight against
  const forFightAgainstCryptomons = otherCryptomons
    .filter((mon) => !mon.forSale)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          <div className="fight-choice-div">
            <button
              className="fight-Choice-btn rpgui-button"
              type="button"
              style={{ float: 'right' }}
              onClick={() => {
                setFightChoice2(mon.id)
              }}
            >
              Choice 2
            </button>
          </div>
        </div>
      </React.Fragment>
    ))

  // div with user's shared Cryptomons
  const sharedByMe = myCryptomons
    .filter((mon) => mon.sharedTo.toLowerCase() !== account)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          <div className="sharing-div">
            <div className="shareTo-owner">Shared to address: {mon.sharedTo} </div>
            <button
              className="stop-sharing-btn rpgui-button"
              type="button"
              style={{ float: 'right' }}
              onClick={() => stopSharing(mon.id)}
            >
              Stop sharing
            </button>
          </div>
        </div>
      </React.Fragment>
    ))

  // div with Cryptomons shared to the user
  const sharedToMe = otherCryptomons
    .filter((mon) => mon.sharedTo === account)
    .map((mon) => (
      <React.Fragment key={mon.id}>
        <div className="mon">
          <figure className="my-figure">
            {nameDiv(mon)}
            {imgDiv(mon)}
            <figcaption>{statDiv(mon)}</figcaption>
          </figure>
          <div className="sharing-div">
            <label className="shared-owner">Creature Owner: {mon.owner} </label>
            <button
              className="stop-sharing-btn rpgui-button"
              type="button"
              style={{ float: 'right' }}
              onClick={() => stopSharing(mon.id)}
            >
              Stop sharing
            </button>
          </div>
        </div>
      </React.Fragment>
    ))

  // Function that does all the rendering of the application
  return (
    // Creation of the different tabs of the UI
    <div className="rpgui-content">
      <ToastContainer />

      <div className="AppTitle">
        <img src="/favicon-16x16.png" alt="lokian-logo" /> <span>L O K I A N </span>
        {/* wallet buttons */}
        <span style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
          {/* wallet logout */}
        
          <div>
            {(active || error) && (
              <button
                className="rpgui-button"
                onClick={() => {
                  deactivate()
                  setCryptomons([])
                  setMyCryptomons([])
                  setOtherCryptomons([])
                  setWinner(null)
                  setRounds(null)
                  setValue(0)
                }}
              >
                Logout
              </button>
            )}

            {/* {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>} */}
          </div>
          {Object.keys(connectorsByName).map((name) => {
            const currentConnector = connectorsByName[name]
            const activating = currentConnector === activatingConnector
            const connected = currentConnector === connector
            const disabled = !triedEager || !!activatingConnector || connected || !!error

            return (
              <button
                className="rpgui-button golden"
                type="button"
                style={{
                  fontSize: '20px',
                  paddingTop: '14px',
                }}
                onClick={() => {
                  setActivatingConnector(currentConnector)
                  activate(currentConnector)
                }}
                disabled={disabled}
                key={name}
              >
                {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                <Account /> <div style={{ display: 'none' }}>{name}</div>
                {!account ? `Connect wallet` : ''}
              </button>
            )
          })}

        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}

        </span>
      </div>

      <Tabs defaultActiveKey="tokens" id="uncontrolled-tab-example">
        <Tab className="x" eventKey="myCryptomons" title="My Creatures">
          <div className="p1">Your Entries</div>
          {myCryptomonsDiv}
        </Tab>
        <Tab eventKey="forSale" title="For trade">
          <div className="p1">Manage Trade</div>
          {forSaleCryptomons}
        </Tab>
        <Tab eventKey="buyCryptomons" title="Trade Creatures">
          {buyCryptomons}
        </Tab>
        <Tab eventKey="breedCryptomons" title="Breed Creatures">
          <div className="p1">Breeding Grounds</div>
          <div className="breeding-area">
            {breedOption(breedChoice1)}
            {breedOption(breedChoice2)}
            <div className="p2">proceeed to mint nft ($0.05)</div>
            <button
              className="rpgui-button"
              type="button"
              style={{ width: '420px' }}
              onClick={() => breedMons(breedChoice1, breedChoice2)}
            >
              Breed choosen creatures
            </button>
          </div>

          <br />
          <div className="p1">Breeding Results</div>
          <br />
          {forBreedCryptomons}
        </Tab>
        <Tab eventKey="fight" title="Fight">
          <div className="p1">Arena</div>
          <div className="fighting-area">
            {}
            {breedOption(fightChoice1)}
            {breedOption(fightChoice2)}
            <label className="winner-label">
              And the winner is... {names[cryptomons.find((mon) => mon.id?.toString() === winner?.toString())?.species]}
              {/* untested */}
              {winner === 1000 ? "no one, it's a tie" : ''}
              {winner === 2000 ? 'unknown' : ''}
            </label>

            {winner !== 1000 || winner !== 2000 ? (
              <>
                <br />
                <label className="winner-label">Winning creature's Id: {winner}</label>
                <br />
                <label className="winner-label">Rounds the fight lasted: {rounds}</label>
              </>
            ) : (
              ''
            )}

            <button
              className="rpgui-button"
              type="button"
              onClick={() => {
                setWinner(null)
                setRounds(null)
                fight(fightChoice1, fightChoice2)
              }}
            >
              Fight with choosen creatures
            </button>
          </div>
          <div className="fight-mons-<h1>Sharing Management</h1>area">
            <div className="fightWith-area border-gradient border-gradient-purple">
              <div className="p2">Your Creatures</div>
              {forFightWithCryptomons}
            </div>
            <div className="fightAgainst-area border-gradient border-gradient-purple">
              <div className="p2">Opponent Creatures</div>
              {forFightAgainstCryptomons}
            </div>
          </div>
        </Tab>
        <Tab eventKey="share" title="Share Creatures">
          <div className="p1">Sharing Management</div>
          <div className="sharing-area">
            <div className="form-line">
              <label className="form-label">Creature Id:</label>
              <input className="form-input" value={shareId} onChange={(e) => handleShareId(e)} />
            </div>
            <div className="form-line">
              <label className="form-label">Share to address:</label>
              <input className="form-input" value={shareAddress} onChange={(e) => handleShareAddress(e)} />
            </div>
            <div className="form-line">
              <button
                className="rpgui-button"
                type="button"
                style={{ float: 'right' }}
                onClick={() => startSharing(shareId, shareAddress)}
              >
                Share
              </button>
            </div>
          </div>
          {sharedByMe}
        </Tab>
        <Tab eventKey="sharedToMe" title="Shared To Me">
          <div className="p1">Shared To You</div>
          {sharedToMe}
        </Tab>
        {/* <Tab eventKey="highscore" title="High Scores">
          <div className="p1">HIGHSCORES</div>
          <div className="sharing-area">
            <div className="form-line">
              <label className="form-label">Name:</label>
              <input className="form-input" 
                value={account} 
                onChange={(e) => 
                  {
                    handleHighscoreChangeName(e)
                  }
                }
               />
            </div>
            <div className="form-line">
              <label className="form-label">Session Wins:</label>
              <input className="form-input" value="" disabled />
            </div>
            <div className="form-line">
              <label className="form-label">Session Losses:</label>
              <input className="form-input" value="" disabled />
            </div>
            <div className="form-line">
              <button className="rpgui-button" type="button" style={{ float: 'right' }}>
                Record
              </button>
            </div>
          </div>
          {highscoresDiv}
        </Tab> */}
      </Tabs>
    </div>
  )
}

export default App
