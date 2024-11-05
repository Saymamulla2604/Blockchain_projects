var ContractABI=[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "deposite",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getbalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getcontractbalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawfunds",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	}
];

var ContractAddress='0xb20dF42Bbec6163F31c74103EaF79065c68eF3EA';

var loginbutton = document.getElementById('connect_to_metamask')
var useraddress = document.getElementById('accountaddress')
var depositeinput = document.getElementById('depositeeth')
var depositebutton = document.getElementById('depositebutton')
var withdrawinput = document.getElementById('withdraweth')
var withdrawbutton = document.getElementById( 'withdrawbutton')
var getbalancebutton = document.getElementById('getbalance')
var balance = document.getElementById('balance')
var address, web3, myContract

document.addEventListener('DOMContentLoaded', async()=>
{
    if(typeof window.ethereum != 'undefined')
    {
        console.log('Metamask is installed')

         web3 = new Web3(window.ethereum);
        console.log("web3 is loaded",web3);

         myContract=new web3.eth.Contract(ContractABI,ContractAddress);
        console.log("contract is loaded",myContract);

		loginbutton.addEventListener('click',async()=>{
			var accounts =await ethereum.request({method: 'eth_requestAccounts'});
			address = accounts[0];
			useraddress.innerText =address;

			useraddress.classList.remove('d-none');
			loginbutton.classList.add('d-none');
			console.log(accounts);
			console.log(accounts[0]);
		});
		ethereum.on('accountsChanged',async function(accounts){
            var accounts =await ethereum.request({method:'eth_requestAccounts'});
			address =accounts[0];
			useraddress.innerText = address;
		}); 
		depositebutton.addEventListener('click', () => {
			const amountInWei = web3.utils.toWei(depositeinput.value, 'ether');
			//console.log(depositeinput.value);
			myContract.methods.deposite().send({from :address, value: amountInWei}, function (err, res) {
			console.log(res);
			})
			});
		withdrawbutton.addEventListener('click', () => {
			const amountInWei = web3.utils.toWei(withdrawinput.value, 'ether');
			myContract.methods.withdraw(amountInWei).send({from: address}, function (err, res) {
			console.log(res);
			})
			});
		getbalancebutton.addEventListener('click',()=>{
				myContract.methods.getbalance().call({from: address}, function (err, res) {
					if (!err) {
						const balanceInWei = res;
						const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
						balance.innerText = balanceInEther;
					} else {
						console.error(err);
					}
			})
	    });
		
    }
    else{
        alert('please install metamask')
    }
})