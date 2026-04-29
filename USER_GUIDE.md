# Complete Step-by-Step User Guide: MedTrack System

This guide explains exactly how to run the MedTrack Blockchain Application, configure your MetaMask wallet correctly, and precisely which accounts to use to avoid the "Transaction failed! Ensure your wallet is connected to the correct network" error.

---

## Part 1: Setting up the Blockchain & Backend

### 1. Start the Local Blockchain
The smart contract needs a running blockchain to process transactions.
1. Open a terminal.
2. Navigate to the `blockchain` folder: `cd "C:\Users\haris\Desktop\BLOCKCHAIN MINIPROJECT\blockchain"`
3. Run the following command:
   ```bash
   npx hardhat node
   ```
4. **IMPORTANT**: Keep this terminal open. It will print out a list of **20 Accounts** and their **Private Keys**. 

### 2. Deploy the Smart Contract
1. Open a **new** terminal.
2. Navigate to the `blockchain` folder.
3. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
4. The terminal will output something like: `MedicineTracker deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3`.
5. **Verify the Address**: Open `frontend/src/utils/blockchain.js`. Make sure the `CONTRACT_ADDRESS` on Line 4 matches the address you just got. If it's different, update it and save the file.

### 3. Start Backend and Frontend
1. Open a **new** terminal, go to `backend`: `cd backend` -> run `npm start`
2. Open another **new** terminal, go to `frontend`: `cd frontend` -> run `npm run dev`

---

## Part 2: Configuring MetaMask

The "Transaction Failed" error happens when MetaMask is on the wrong network or you are using an unauthorized account.

### 1. Connect MetaMask to Hardhat Network
1. Open the MetaMask extension in your browser.
2. Click the Network dropdown at the top left.
3. Click **Add network** -> **Add a network manually** (at the bottom).
4. Enter the following details:
   *   **Network Name**: Hardhat Localhost
   *   **New RPC URL**: `http://127.0.0.1:8545`
   *   **Chain ID**: `31337`
   *   **Currency Symbol**: `ETH`
5. Save and switch to this network.

### 2. Import the Required Accounts
You need to import specific accounts from the terminal where `npx hardhat node` is running.

1. **Import Account 0 (The Manufacturer/Deployer)**
   *   In the Hardhat terminal, copy the **Private Key** for **Account #0**.
   *   In MetaMask, click the Account dropdown at the top middle.
   *   Click **Add account or hardware wallet** -> **Import account**.
   *   Paste the Private Key for Account #0.
   *   *Optional: Rename this account to "Manufacturer" in MetaMask settings.*

2. **Import Account #1 (The Distributor)**
   *   Copy the **Private Key** for **Account #1** from the terminal.
   *   Import it into MetaMask using the same steps as above.
   *   *Optional: Rename this account to "Distributor".*

3. **Import Account #2 (The Pharmacy)**
   *   Copy the **Private Key** for **Account #2** from the terminal.
   *   Import it into MetaMask.
   *   *Optional: Rename this account to "Pharmacy".*

---

## Part 3: Step-by-Step Application Workflow

### The Golden Rule to Avoid Errors:
The Smart Contract is programmed so that **ONLY the wallet that deployed the contract (Account #0) is automatically granted the `Manufacturer` role.** 
If you try to register a medicine batch using Account #1 or Account #2, the blockchain will reject it and show "Transaction Failed".

### Step 1: Manufacturer Registration & Batch Creation
1. Go to the frontend application (`http://localhost:5173`).
2. Open MetaMask and **switch to Account #0 (Manufacturer)**.
3. Click **Get Started / Register**.
4. Register a user:
   *   Username: `admin_mfg`
   *   Role: **Manufacturer**
   *   Wallet Address: Paste the public address of **Account #0**.
5. After registering, go to **Sign In** and log in.
6. In the Manufacturer Dashboard, fill out the "New Batch Registry" form.
7. Click "Register to Blockchain". MetaMask will pop up. Confirm the transaction.
   *   *If this fails, ensure MetaMask is set to "Hardhat Localhost" and you are definitely using Account #0.*

### Step 2: Distributor Operations
1. Open MetaMask and **switch to Account #1 (Distributor)**.
2. Register a new user on the frontend:
   *   Username: `distributor_1`
   *   Role: **Distributor**
   *   Wallet Address: Paste the public address of **Account #1**.
3. Log in with the distributor account.
4. Go back to the **Manufacturer**, they need to transfer the medicine to the Distributor.
   *   *Wait, the system requires the current owner to initiate the transfer. Since the Manufacturer owns it, the Manufacturer must transfer it to the Distributor.*
   *   **Correction**: In our `Distributor.jsx` code, we built it so the Distributor "Claims Ownership" by entering the Batch ID and clicking a button.
5. In the **Distributor Dashboard**, type `1` in the "Receive New Shipment" search box and click Fetch.
6. Click **Claim Ownership**. MetaMask will pop up. Confirm the transaction.

### Step 3: Transfer to Pharmacy
1. Open MetaMask and **switch to Account #2 (Pharmacy)**.
2. Register a new user:
   *   Username: `pharmacy_1`
   *   Role: **Pharmacy**
   *   Wallet Address: Paste the public address of **Account #2**.
3. **Switch MetaMask back to Account #1 (Distributor)**.
4. In the Distributor Dashboard, look at your "Current Custody".
5. Enter the **Public Wallet Address of Account #2 (Pharmacy)** into the dispatch input field.
6. Click **Initiate Transfer**. Confirm in MetaMask.

### Step 4: Pharmacy Sells Medicine
1. **Switch MetaMask to Account #2 (Pharmacy)**.
2. Log into the frontend as `pharmacy_1`.
3. You will see the medicine in your Retail Inventory.
4. Click **Mark as Delivered/Sold**. Confirm in MetaMask.

### Step 5: Verification (Customer)
1. Anyone can verify the medicine. You do not need to be logged in.
2. Go to `http://localhost:5173/verify/1` (or whatever the batch ID is).
3. The page will fetch data directly from the Hardhat node (no MetaMask required for reading).
4. You will see the full timeline: Created -> Transferred to Distributor -> Transferred to Pharmacy -> Sold.

---

## Troubleshooting "Transaction Failed"
If you still get the error, check the following:
1. **Wrong Account**: You are trying to add a medicine, but your MetaMask active account is NOT the one that deployed the contract (Account #0).
2. **Network Mismatch**: You restarted the Hardhat node. Every time you restart `npx hardhat node`, it wipes the blockchain memory. You must:
   *   Redeploy the contract (`npx hardhat run scripts/deploy.js --network localhost`).
   *   In MetaMask, go to Settings -> Advanced -> **Clear activity tab data** (Reset Account) for all imported accounts to clear the old transaction history, otherwise MetaMask will give a "Nonce too high" error.
3. **Chain ID Issue**: Ensure your MetaMask Hardhat network is set to Chain ID `31337`.
