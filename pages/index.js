import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);
  const [amount, setAmount] = useState(0);
  const [progress, setProgress] = useState(50); // Ejemplo de progreso del 50%

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []); // Añade [] como segundo argumento

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Solicita al usuario que conecte su billetera
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Crea un proveedor Ethers.js a partir de la conexión de MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        //console.log("Web3Provider instance created successfully.");
        // Obtiene el signer (que representa la cuenta del usuario)
        const signer = await provider.getSigner();
        setSigner(signer);
        //console.log("Usuario conseguido.");
        // Obtiene la dirección de la cuenta del usuario
        const address = await signer.getAddress();
        setSignerAddress(address);
        //console.log("Dirrecion conseguida.");
        //conectado
        setIsConnected(true);
        //console.log("Realizo toda la funcion")
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  const toWei = ether => ethers.parseEther(ether);

  async function execute() {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = "0x567580a3f9A2Def945F59d972b338A3Ddc8cb61c";
      const abi = [
        {
          "type": "constructor",
          "inputs": [
            {
              "name": "_rate",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "_wallet",
              "type": "address",
              "internalType": "address payable"
            },
            {
              "name": "_token",
              "type": "address",
              "internalType": "contract ERC20"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "fallback",
          "stateMutability": "payable"
        },
        {
          "type": "receive",
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "buyTokens",
          "inputs": [
            {
              "name": "_beneficiary",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "rate",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "token",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "contract ERC20"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "wallet",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address payable"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "weiRaised",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "event",
          "name": "TokenPurchase",
          "inputs": [
            {
              "name": "purchaser",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "beneficiary",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "value",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        }
      ];
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const wei = toWei(amount);
        // Ensure signerAddress is defined and valid before using it
        if (signerAddress) {
          await contract.buyTokens(signerAddress, { value: wei });
        } else {
          console.error("Signer address is not set");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/baldpepa.png" alt="Logo" width={100} height={100} />
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><a href="#home-section">HOME</a></li>
            <li><a href="#about-section">ABOUT US</a></li>
            <li><a href="#how-to-buy-section">HOW TO BUY</a></li>
            <li><a href="#meme-section">MEME</a></li>
          </ul>
        </nav>
        <button className={styles.connectButton} onClick={() => connect()}>
          {hasMetamask ? (
            isConnected ? (
              "Connected!"
            ) : (
              "Connect"
            )
          ) : (
            "Please install MetaMask"
          )}
        </button>
      </header>
      <div className={styles.containerGeneral}>
        {/* Container Home */}
        <div id="home-section" className={styles.containerHome}>
          <div className={styles.containerHome1}>
            <h2 >Bald Pepa Coin | Pre-Sale Price</h2>
            <p >The Most Memeable Memecoin In Existence!</p>
            <br />
            <p >Its Time For Pepa To Take Reign </p>
            <br />
            <p >The Offer Is Valid Until April 15 </p>
            <br />
          </div>
          <div className={styles.containerHome2}>
            <h2 >Pre-Sale</h2>
            <p >Price: 1 PEPA = $0.0043</p>
            <p >Progress: <span>{progress} BNB</span> / 1000 BNB</p>
            <div className={styles.progress}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.inputBNB}>
                <input
                  className={styles.inputField}
                  placeholder="Input BNB Amount"
                  onChange={e => setAmount(e.target.value)}
                />
                <span className={styles.currency}>BNB</span>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              {isConnected && (
                <button className={`${styles.executeButton} executeButton`} onClick={() => execute()}>
                  BUY TOKEN
                </button>
              )}
            </div>
            <p >You will Receive: {(amount * 133333) + " PEPA"}</p>
          </div>
        </div>
        {/* Container About */}
        <div id="about-section" className={styles.containerAbout}>
          <div className={styles.containerAbout1}>
            <p> Bald Pepa is tired of watching everyone play hot potato with the
              endless derivative ShibaCumGMElonKishuTurboAssFloki Moon
              Inu coins. The Inus have had their day. Its time for the most
              recognizable meme in the world to take his reign as king of the
              memes.</p>
          </div>
          <div className={styles.containerAbout2}>
            <img src="/baldpepa.png" alt="baldpepa" />
          </div>
        </div>
        {/* Container How To Buy */}
        <div id="how-to-buy-section" className={styles.containerHowToBuy}>
          <div className={styles.containerHowToBuy1}>
            <Image src="/pancakeswap.png" alt="pancakeswap" width={100} height={100} />
            <h3>Create a Wallet</h3>
            <p> Download metamask or your wallet choice from the app
              store or google play store for free,
              Desktop users, download the google chrome extension by going
              to metamask.io
            </p>
          </div>
          <div className={styles.containerHowToBuy2}>
            <Image src="/bnb.png" alt="bnb" width={100} height={100} />
            <h3>Get Some BNB</h3>
            <p>Have BNB in your wallet to switch to $BALDPEPA. if you
              dont have any BNB, you can buy directly on metamask
              ,transfer from another wallet, or buy on another exchange
              and send it to your wallet </p>
          </div>
          <div className={styles.containerHowToBuy3}>
            <Image src="/metamask.png" alt="metamask" width={100} height={100} />
            <h3>Go to Pancakeswap</h3>
            <p> Connect to Pancakeswap. Go to pancakeswap.finance in google chrome or on the browser
              inside your Metamask app. Connect your wallet. Paste the $MINIPEPE token address into pancakeswap,
              select Minipepe, and confirm. When Metamask prompts you for a wallet signature, sign.</p>
          </div>
          <div className={styles.containerHowToBuy4}>
            <Image src="/baldpepa.png" alt="baldpepa" width={100} height={100} />
            <h3>Switch BNB for $BALDPEPA</h3>
            <p> Switch BNB for $BALDPEPA. We have ZERO taxes so you dont need to worry about buying
              with a specific slippage, although you may need to use slippage during times of market
              volatility.</p>
          </div>
        </div>
        {/* Container Meme */}
        <div id="meme-section" className={styles.containerMeme}>
          <div className={styles.containerMeme1}>
            <Image src="/meme1.png" alt="meme1" width={500} height={300} />
          </div>
          <div className={styles.containerMeme2}>
            <Image src="/meme2.png" alt="meme2" width={500} height={300} />
          </div>
          <div className={styles.containerMeme3}>
            <Image src="/meme3.png" alt="meme3" width={500} height={300} />
          </div>
          <div className={styles.containerMeme4}>
            <Image src="/meme4.png" alt="meme4" width={500} height={300} />
          </div>
          <div className={styles.containerMeme5}>
            <Image src="/meme5.png" alt="meme5" width={500} height={300} />
          </div>
          <div className={styles.containerMeme6}>
            <Image src="/meme6.png" alt="meme6" width={500} height={300} />
          </div>
        </div>
      </div>
    </div >
  );
}