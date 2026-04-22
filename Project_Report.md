# EXP NO – 6 : MINI PROJECT
## MedTrack - Blockchain-Based Medicine Supply Chain Tracking & QR Code Verification System

**AIM:**  
To design and develop a secure, transparent, and decentralized medicine supply chain tracking system that ensures product authenticity from the manufacturer to the customer using blockchain technology and QR code verification.

---

### THEORY

#### 1. Introduction
The pharmaceutical industry faces significant challenges regarding the proliferation of counterfeit medicines and a lack of transparency in the supply chain. Traditional tracking systems are often centralized, making them vulnerable to data manipulation, lack of real-time visibility, and single points of failure.

Blockchain technology provides an immutable and distributed ledger that can record every step of a medicine's journey. By integrating blockchain with QR code technology, we can create a trustless environment where every batch of medicine can be verified for authenticity by any stakeholder, including the end customer.

#### 2. Need of the Project
Existing medicine supply chains:
*   Rely on centralized databases prone to tampering.
*   Lack real-time tracking across multiple stakeholders (Manufacturer, Distributor, Pharmacy).
*   Provide no easy way for consumers to verify if a medicine is genuine or counterfeit.
*   Are vulnerable to the entry of "fake" medicines at various points in the logistics chain.

There is a critical need for a system that ensures:
*   **Tamper-proof records**: Once a batch is registered, its history cannot be altered.
*   **Transparency**: Full visibility of ownership transfers.
*   **Product Authenticity**: Instant verification via unique digital identities.
*   **Secure Tracking**: End-to-end monitoring from production to consumption.

#### 3. Proposed System (What is MedTrack?)
MedTrack is a decentralized supply chain application that uses:
*   **Blockchain** for storing immutable transaction records and ownership history.
*   **Smart Contracts** to automate ownership transfers and status updates.
*   **QR Codes** for instant product identity and verification.
*   **MetaMask** for secure, decentralized user authentication and digital signatures.

**Key Features:**
*   **Manufacturer Module**: Register new medicine batches and generate unique QR codes.
*   **Distributor Module**: Receive shipments and claim ownership on the blockchain.
*   **Pharmacy Module**: Manage authentic stock and mark medicines as sold to the final consumer.
*   **Customer Verification Portal**: Public interface to scan QR codes and view the complete supply chain history.
*   **No Cryptocurrency Required**: Operates on a local blockchain network for enterprise-level tracking without volatile asset dependency.

#### 4. Tools and Techniques Used

1.  **Blockchain (Ethereum – Hardhat)**
    Hardhat is used to manage the local blockchain environment. It facilitates the development, deployment, and testing of smart contracts, providing a robust infrastructure for the supply chain ledger.
2.  **Smart Contracts (Solidity)**
    The core logic is written in Solidity. The `MedicineTracker` contract manages medicine identities, status (Manufactured, In Transit, Received, Sold), and the immutable history of every transfer.
3.  **MetaMask**
    Acts as the identity provider. Each stakeholder (Manufacturer, Distributor, etc.) uses their unique wallet address to sign transactions, ensuring accountability for every move in the chain.
4.  **Ethers.js**
    The bridge between the frontend and the blockchain. It allows the React application to interact with smart contracts and listen for real-time events.
5.  **Backend (Node.js + Express + MongoDB)**
    Handles off-chain data such as user profiles and metadata. MongoDB stores detailed organizational information while the blockchain handles the critical tracking data.
6.  **Frontend (React + Tailwind CSS + Framer Motion)**
    Provides a professional, high-end dashboard with smooth animations and responsive design, making complex blockchain data accessible to all users.
7.  **QR Code Integration**
    Automatically generates unique QR codes for every batch, encoded with a direct link to the blockchain verification portal.

---

### ARCHITECTURE OF THE SYSTEM
The system follows a 3-tier decentralized architecture:
1.  **Presentation Layer (Frontend)**: React dashboards for different roles.
2.  **Logic Layer (Backend & Smart Contracts)**: Node.js API for off-chain data and Solidity contracts for on-chain logic.
3.  **Data Layer (Blockchain & Database)**: Ethereum (Hardhat) for immutable records and MongoDB for user/metadata.

---

### WORKING

1.  **User Authentication using MetaMask**
    Stakeholders log in by connecting their MetaMask wallet. Their unique wallet address determines their role (Manufacturer, Distributor, or Pharmacy) and grants access to specific dashboard features.
2.  **Medicine Batch Registration**
    The Manufacturer enters medicine details (Name, Batch No, Mfg/Exp dates). A transaction is sent to the blockchain, creating a new, immutable record with a unique ID.
3.  **QR Code Generation**
    Upon successful blockchain registration, the system generates a unique QR code. This code contains a URL pointing to the verification page for that specific batch ID.
4.  **Ownership Transfer (Distributor)**
    When a shipment moves to a Distributor, they "claim" the batch by scanning the ID. The smart contract updates the `currentOwner` to the Distributor's wallet address.
5.  **Final Receipt (Pharmacy)**
    The Pharmacy receives the shipment from the Distributor and performs a final ownership transfer on the blockchain. The medicine's status is updated to "Received".
6.  **Mark as Sold**
    When a customer purchases the medicine, the Pharmacy marks it as "Sold" on the blockchain. This prevents the same QR code from being used for another "fake" product in the future.
7.  **Customer Verification**
    A customer scans the QR code on the package. The application fetches the batch history from the blockchain and displays the full journey (Manufacturer -> Distributor -> Pharmacy) along with the current status and authenticity confirmation.
8.  **Access Control & Security**
    Before any file is accessed, the smart contract verifies whether the requesting user has permission. Only the current owner of a batch can initiate a transfer, and only registered manufacturers can create new batches, ensuring the integrity of the entire chain.

---

### RESULT
The **MedTrack** system was successfully developed and tested on a local Hardhat network. The system demonstrated:
*   Secure registration of medicine batches.
*   Seamless transfer of ownership between stakeholders via blockchain transactions.
*   Instant authenticity verification through the public portal.
*   Full traceability of the supply chain journey, effectively preventing the introduction of counterfeit products.

---

### CONCLUSION
In conclusion, the MedTrack system successfully demonstrates how blockchain technology can revolutionize pharmaceutical supply chains. By replacing centralized, opaque systems with a decentralized and immutable ledger, we ensure data integrity, prevent fraud, and build trust between manufacturers and consumers. The integration of QR codes and real-time blockchain tracking provides a powerful tool for global healthcare security.
