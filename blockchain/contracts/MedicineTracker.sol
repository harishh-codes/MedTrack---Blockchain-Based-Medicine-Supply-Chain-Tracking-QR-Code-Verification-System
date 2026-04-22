// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicineTracker {
    enum Role { None, Manufacturer, Distributor, Pharmacy }
    enum MedicineStatus { Manufactured, InTransit, ReceivedByPharmacy, Sold }

    struct TransferRecord {
        address from;
        address to;
        uint256 timestamp;
        string details;
    }

    struct Medicine {
        uint256 id;
        string name;
        string batchNumber;
        string mfgDate;
        string expDate;
        address manufacturer;
        address currentOwner;
        MedicineStatus status;
        bool isAuthentic;
        uint256 transferCount;
    }

    mapping(uint256 => Medicine) public medicines;
    mapping(uint256 => TransferRecord[]) public medicineHistory;
    mapping(address => Role) public roles;
    address public admin;

    uint256 public medicineCount;

    event MedicineAdded(uint256 id, string name, address manufacturer);
    event MedicineTransferred(uint256 id, address from, address to, string status);
    event RoleGranted(address user, Role role);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRole(Role role) {
        require(roles[msg.sender] == role, "Unauthorized role");
        _;
    }

    constructor() {
        admin = msg.sender;
        roles[msg.sender] = Role.Manufacturer; // Admin is also a manufacturer for demo
    }

    function grantRole(address user, Role role) public onlyAdmin {
        roles[user] = role;
        emit RoleGranted(user, role);
    }

    function addMedicine(
        string memory name,
        string memory batchNumber,
        string memory mfgDate,
        string memory expDate
    ) public onlyRole(Role.Manufacturer) {
        medicineCount++;
        medicines[medicineCount] = Medicine({
            id: medicineCount,
            name: name,
            batchNumber: batchNumber,
            mfgDate: mfgDate,
            expDate: expDate,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            status: MedicineStatus.Manufactured,
            isAuthentic: true,
            transferCount: 0
        });

        TransferRecord memory record = TransferRecord({
            from: address(0),
            to: msg.sender,
            timestamp: block.timestamp,
            details: "Medicine Manufactured"
        });
        medicineHistory[medicineCount].push(record);

        emit MedicineAdded(medicineCount, name, msg.sender);
    }

    function transferMedicine(
        uint256 id,
        address to,
        string memory details,
        MedicineStatus newStatus
    ) public {
        require(medicines[id].currentOwner == msg.sender, "You are not the owner");
        require(medicines[id].isAuthentic, "Medicine is not authentic");

        medicines[id].currentOwner = to;
        medicines[id].status = newStatus;
        medicines[id].transferCount++;

        TransferRecord memory record = TransferRecord({
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            details: details
        });
        medicineHistory[id].push(record);

        emit MedicineTransferred(id, msg.sender, to, details);
    }

    function getMedicineHistory(uint256 id) public view returns (TransferRecord[] memory) {
        return medicineHistory[id];
    }

    function verifyMedicine(uint256 id) public view returns (
        bool authentic,
        string memory name,
        string memory batch,
        address manufacturer,
        address currentOwner,
        MedicineStatus status
    ) {
        Medicine memory m = medicines[id];
        return (m.isAuthentic, m.name, m.batchNumber, m.manufacturer, m.currentOwner, m.status);
    }
}
