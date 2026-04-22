import { ethers } from 'ethers';

// This would be replaced by the actual deployed address from scripts/deploy.js
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const CONTRACT_ABI = [
	"function addMedicine(string name, string batchNumber, string mfgDate, string expDate) public",
	"function transferMedicine(uint256 id, address to, string details, uint8 newStatus) public",
	"function getMedicineHistory(uint256 id) public view returns (tuple(address from, address to, uint256 timestamp, string details)[])",
	"function verifyMedicine(uint256 id) public view returns (bool authentic, string name, string batch, address manufacturer, address currentOwner, uint8 status)",
	"function medicineCount() public view returns (uint256)",
	"function medicines(uint256) public view returns (uint256 id, string name, string batchNumber, string mfgDate, string expDate, address manufacturer, address currentOwner, uint8 status, bool isAuthentic, uint256 transferCount)",
	"event MedicineAdded(uint256 id, string name, address manufacturer)",
	"event MedicineTransferred(uint256 id, address from, address to, string status)"
];

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const getContract = async (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
