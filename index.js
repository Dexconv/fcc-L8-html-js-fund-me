import { ethers } from "./ethers-5.1.esm.min.js"
import { ABI, contractAddress } from "./constants.js"

const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
fundButton.onclick = fund
connectButton.onclick = connect
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, ABI, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTxMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider -> connection to the blockchain
        // signer => wallet -> someone with gas
        // contract that we are intraction with
        // ^ ABI and address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        //console.log(signer)
        const contract = new ethers.Contract(contractAddress, ABI, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxMined(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTxMined(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}...`)
    //listen for transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
