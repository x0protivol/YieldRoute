// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title YieldRoute
 * @notice On-chain registry for the YieldRoute Sponsored Intent protocol
 * @dev Deployed on Circle Arc L1 Testnet (Chain ID: 5042002)
 *      RPC: https://rpc.testnet.arc.network
 *      Explorer: https://testnet.arcscan.app
 *
 * YieldRoute replaces Web3 display ads with "Sponsored Intent" -
 * DeFi protocols bid to sponsor AI compute costs via x402 nanopayments
 * in exchange for liquidity routing (TVL acquisition).
 *
 * Built for Circle Hackathon 2026
 */
contract YieldRoute {

    // =========================================================
    // State Variables
    // =========================================================

    address public owner;
    address public usdcToken; // USDC on Arc Testnet

    uint256 public totalRoutings;        // Total sponsored intents executed
    uint256 public totalVolumeRouted;    // Total USDC routed (in USDC base units)
    uint256 public totalPaymentsSettled; // Total micro-payments settled (in USDC base units)
    uint256 public constant MARKETPLACE_FEE_BPS = 2000; // 20% fee in basis points

    // =========================================================
    // Structs
    // =========================================================

    struct SponsoredIntent {
        address sponsor;        // DeFi protocol that paid (e.g. Aave)
        address aiNode;         // AI compute node that served the request
        uint256 amountPaid;     // USDC paid for compute (in base units, e.g. 5000 = $0.005)
        uint256 amountRouted;   // USDC routed to protocol (e.g. 1000000000 = $1000)
        string  intentHash;     // Hash of the user's intent (privacy-preserving)
        string  protocolName;   // Human-readable protocol name (e.g. "Aave v3")
        uint256 timestamp;
        bool    settled;
    }

    struct ProtocolBid {
        address protocol;
        string  name;
        uint256 maxBidPerQuery; // Max USDC willing to pay per AI query (base units)
        uint256 totalSpent;
        uint256 totalTVLAcquired;
        bool    active;
    }

    // =========================================================
    // Mappings
    // =========================================================

    mapping(uint256 => SponsoredIntent) public intents;
    mapping(address => ProtocolBid)     public protocolBids;
    mapping(address => uint256)         public aiNodeRevenue;
    address[]                           public registeredProtocols;

    // =========================================================
    // Events
    // =========================================================

    event IntentSponsored(
        uint256 indexed intentId,
        address indexed sponsor,
        address indexed aiNode,
        uint256 amountPaid,
        uint256 amountRouted,
        string protocolName
    );

    event ProtocolRegistered(
        address indexed protocol,
        string name,
        uint256 maxBidPerQuery
    );

    event IntentSettled(
        uint256 indexed intentId,
        uint256 amountPaid,
        uint256 marketplaceFee
    );

    // =========================================================
    // Constructor
    // =========================================================

    constructor(address _usdcToken) {
        owner = msg.sender;
        usdcToken = _usdcToken;
    }

    // =========================================================
    // Modifiers
    // =========================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "YieldRoute: not owner");
        _;
    }

    // =========================================================
    // Core Functions
    // =========================================================

    /**
     * @notice Register a DeFi protocol as an advertiser on YieldRoute
     * @param _name     Human-readable protocol name (e.g. "Aave v3")
     * @param _maxBid   Maximum USDC willing to pay per AI query (in base units)
     */
    function registerProtocol(string calldata _name, uint256 _maxBid) external {
        require(_maxBid > 0, "YieldRoute: bid must be > 0");
        require(bytes(_name).length > 0, "YieldRoute: name required");

        if (!protocolBids[msg.sender].active) {
            registeredProtocols.push(msg.sender);
        }

        protocolBids[msg.sender] = ProtocolBid({
            protocol: msg.sender,
            name: _name,
            maxBidPerQuery: _maxBid,
            totalSpent: 0,
            totalTVLAcquired: 0,
            active: true
        });

        emit ProtocolRegistered(msg.sender, _name, _maxBid);
    }

    /**
     * @notice Record a sponsored intent on-chain after x402 settlement
     * @dev Called by the YieldRoute Gateway after Circle x402 payment is verified
     * @param _sponsor       Address of the sponsoring DeFi protocol
     * @param _aiNode        Address of the AI compute node
     * @param _amountPaid    USDC paid for compute (base units)
     * @param _amountRouted  USDC routed to the protocol (base units)
     * @param _intentHash    Privacy-preserving hash of user's intent
     * @param _protocolName  Human-readable protocol name
     */
    function recordSponsoredIntent(
        address _sponsor,
        address _aiNode,
        uint256 _amountPaid,
        uint256 _amountRouted,
        string calldata _intentHash,
        string calldata _protocolName
    ) external returns (uint256 intentId) {
        require(_sponsor != address(0), "YieldRoute: invalid sponsor");
        require(_aiNode  != address(0), "YieldRoute: invalid aiNode");
        require(_amountPaid > 0,        "YieldRoute: payment required");

        intentId = totalRoutings;

        intents[intentId] = SponsoredIntent({
            sponsor:      _sponsor,
            aiNode:       _aiNode,
            amountPaid:   _amountPaid,
            amountRouted: _amountRouted,
            intentHash:   _intentHash,
            protocolName: _protocolName,
            timestamp:    block.timestamp,
            settled:      false
        });

        totalRoutings++;
        totalVolumeRouted    += _amountRouted;
        totalPaymentsSettled += _amountPaid;
        aiNodeRevenue[_aiNode] += _amountPaid;

        if (protocolBids[_sponsor].active) {
            protocolBids[_sponsor].totalSpent       += _amountPaid;
            protocolBids[_sponsor].totalTVLAcquired += _amountRouted;
        }

        emit IntentSponsored(intentId, _sponsor, _aiNode, _amountPaid, _amountRouted, _protocolName);
    }

    /**
     * @notice Mark an intent as fully settled on Arc L1
     * @param _intentId  The intent ID to settle
     */
    function settleIntent(uint256 _intentId) external {
        SponsoredIntent storage intent = intents[_intentId];
        require(!intent.settled, "YieldRoute: already settled");
        require(
            msg.sender == intent.aiNode || msg.sender == owner,
            "YieldRoute: unauthorized"
        );

        intent.settled = true;

        uint256 fee = (intent.amountPaid * MARKETPLACE_FEE_BPS) / 10000;
        emit IntentSettled(_intentId, intent.amountPaid, fee);
    }

    // =========================================================
    // View Functions
    // =========================================================

    function getProtocolCount() external view returns (uint256) {
        return registeredProtocols.length;
    }

    function getIntent(uint256 _id) external view returns (SponsoredIntent memory) {
        return intents[_id];
    }

    function getProtocolBid(address _protocol) external view returns (ProtocolBid memory) {
        return protocolBids[_protocol];
    }

    function getNetworkStats() external view returns (
        uint256 _totalRoutings,
        uint256 _totalVolumeRouted,
        uint256 _totalPaymentsSettled,
        uint256 _registeredProtocols
    ) {
        return (
            totalRoutings,
            totalVolumeRouted,
            totalPaymentsSettled,
            registeredProtocols.length
        );
    }

    // =========================================================
    // Admin
    // =========================================================

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "YieldRoute: zero address");
        owner = _newOwner;
    }

    function updateUSDC(address _usdc) external onlyOwner {
        usdcToken = _usdc;
    }
}
