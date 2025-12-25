// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArticMarketplace
 * @notice Marketplace for buying/selling DeFi strategies on Mantle
 * @dev Handles on-chain payments in MNT with 5% protocol fee
 */
contract ArticMarketplace is Ownable, ReentrancyGuard {
    // ============================================
    // STRUCTS
    // ============================================

    struct Listing {
        address creator;
        uint256 priceMnt;
        bool isActive;
    }

    struct Subscription {
        address owner;
        address delegationWallet;
        bool isActive;
        uint64 subscribedAt;
        uint64 pausedAt;
    }

    // ============================================
    // STATE
    // ============================================

    /// @notice Strategy listings: strategyId => Listing
    mapping(bytes32 => Listing) public listings;

    /// @notice Purchase records: strategyId => buyer => purchased
    mapping(bytes32 => mapping(address => bool)) public purchases;

    /// @notice Creator withdrawable balances
    mapping(address => uint256) public creatorBalances;

    /// @notice Protocol fee in basis points (500 = 5%)
    uint256 public protocolFeeBps = 500;

    /// @notice Treasury address for protocol fees
    address public treasury;

    /// @notice Accumulated protocol fees
    uint256 public protocolFees;

    /// @notice Subscriptions: strategyId => delegationWallet => Subscription
    mapping(bytes32 => mapping(address => Subscription)) public subscriptions;

    /// @notice Active subscriber count per strategy
    mapping(bytes32 => uint256) public subscriberCounts;

    /// @notice User's subscription wallets per strategy: strategyId => owner => delegationWallets[]
    mapping(bytes32 => mapping(address => address[])) public userSubscriptionWallets;

    // ============================================
    // EVENTS
    // ============================================

    event StrategyListed(bytes32 indexed strategyId, address indexed creator, uint256 priceMnt);
    event StrategyUpdated(bytes32 indexed strategyId, uint256 newPrice);
    event StrategyDelisted(bytes32 indexed strategyId);
    event StrategyPurchased(
        bytes32 indexed strategyId,
        address indexed buyer,
        address indexed creator,
        uint256 priceMnt,
        uint256 fee
    );
    event CreatorWithdraw(address indexed creator, uint256 amount);
    event TreasuryWithdraw(address indexed treasury, uint256 amount);
    event ProtocolFeeUpdated(uint256 newFeeBps);
    event TreasuryUpdated(address newTreasury);
    event Subscribed(bytes32 indexed strategyId, address indexed owner, address indexed delegationWallet, uint256 timestamp);
    event SubscriptionPaused(bytes32 indexed strategyId, address indexed delegationWallet, uint256 timestamp);
    event SubscriptionActivated(bytes32 indexed strategyId, address indexed delegationWallet, uint256 timestamp);
    event SubscriptionWalletUpdated(bytes32 indexed strategyId, address indexed oldWallet, address indexed newWallet, uint256 timestamp);

    // ============================================
    // ERRORS
    // ============================================

    error StrategyAlreadyListed();
    error StrategyNotListed();
    error NotStrategyCreator();
    error AlreadyPurchased();
    error InsufficientPayment();
    error NoBalanceToWithdraw();
    error TransferFailed();
    error InvalidPrice();
    error InvalidFee();
    error InvalidTreasury();
    error NotPurchased();
    error AlreadySubscribed();
    error NotSubscribed();
    error NotSubscriptionOwner();
    error SubscriptionAlreadyActive();
    error SubscriptionAlreadyPaused();
    error NewWalletAlreadySubscribed();

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(address _treasury) Ownable(msg.sender) {
        if (_treasury == address(0)) revert InvalidTreasury();
        treasury = _treasury;
    }

    // ============================================
    // CREATOR FUNCTIONS
    // ============================================

    /**
     * @notice List a strategy on the marketplace
     * @param strategyId UUID of the strategy (from off-chain DB)
     * @param priceMnt Price in MNT (wei)
     */
    function listStrategy(bytes32 strategyId, uint256 priceMnt) external {
        if (priceMnt == 0) revert InvalidPrice();
        if (listings[strategyId].isActive) revert StrategyAlreadyListed();

        listings[strategyId] = Listing({
            creator: msg.sender,
            priceMnt: priceMnt,
            isActive: true
        });

        emit StrategyListed(strategyId, msg.sender, priceMnt);
    }

    /**
     * @notice Update the price of a listed strategy
     * @param strategyId UUID of the strategy
     * @param newPrice New price in MNT (wei)
     */
    function updatePrice(bytes32 strategyId, uint256 newPrice) external {
        Listing storage listing = listings[strategyId];
        if (!listing.isActive) revert StrategyNotListed();
        if (listing.creator != msg.sender) revert NotStrategyCreator();
        if (newPrice == 0) revert InvalidPrice();

        listing.priceMnt = newPrice;

        emit StrategyUpdated(strategyId, newPrice);
    }

    /**
     * @notice Remove a strategy from the marketplace
     * @param strategyId UUID of the strategy
     */
    function delistStrategy(bytes32 strategyId) external {
        Listing storage listing = listings[strategyId];
        if (!listing.isActive) revert StrategyNotListed();
        if (listing.creator != msg.sender) revert NotStrategyCreator();

        listing.isActive = false;

        emit StrategyDelisted(strategyId);
    }

    /**
     * @notice Withdraw accumulated earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 balance = creatorBalances[msg.sender];
        if (balance == 0) revert NoBalanceToWithdraw();

        creatorBalances[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        if (!success) revert TransferFailed();

        emit CreatorWithdraw(msg.sender, balance);
    }

    // ============================================
    // BUYER FUNCTIONS
    // ============================================

    /**
     * @notice Purchase a strategy
     * @param strategyId UUID of the strategy to purchase
     */
    function purchaseStrategy(bytes32 strategyId) external payable nonReentrant {
        Listing storage listing = listings[strategyId];
        if (!listing.isActive) revert StrategyNotListed();
        if (purchases[strategyId][msg.sender]) revert AlreadyPurchased();
        if (msg.value < listing.priceMnt) revert InsufficientPayment();

        // Calculate fee (5%)
        uint256 fee = (listing.priceMnt * protocolFeeBps) / 10000;
        uint256 creatorAmount = listing.priceMnt - fee;

        // Record purchase
        purchases[strategyId][msg.sender] = true;

        // Credit creator balance
        creatorBalances[listing.creator] += creatorAmount;

        // Accumulate protocol fees
        protocolFees += fee;

        // Refund excess payment
        if (msg.value > listing.priceMnt) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.priceMnt}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit StrategyPurchased(strategyId, msg.sender, listing.creator, listing.priceMnt, fee);
    }

    // ============================================
    // SUBSCRIPTION FUNCTIONS
    // ============================================

    /**
     * @notice Subscribe a delegation wallet to a purchased strategy
     * @param strategyId The strategy to subscribe to
     * @param delegationWallet The wallet that will run the strategy
     */
    function subscribe(bytes32 strategyId, address delegationWallet) external {
        bool isCreator = listings[strategyId].creator == msg.sender;

        if (!isCreator && !purchases[strategyId][msg.sender]) revert NotPurchased();
        if (subscriptions[strategyId][delegationWallet].subscribedAt != 0) revert AlreadySubscribed();

        subscriptions[strategyId][delegationWallet] = Subscription({
            owner: msg.sender,
            delegationWallet: delegationWallet,
            isActive: true,
            subscribedAt: uint64(block.timestamp),
            pausedAt: 0
        });

        subscriberCounts[strategyId]++;
        userSubscriptionWallets[strategyId][msg.sender].push(delegationWallet);

        emit Subscribed(strategyId, msg.sender, delegationWallet, block.timestamp);
    }

    /**
     * @notice Pause an active subscription
     * @param strategyId The strategy
     * @param delegationWallet The subscribed wallet
     */
    function pauseSubscription(bytes32 strategyId, address delegationWallet) external {
        Subscription storage sub = subscriptions[strategyId][delegationWallet];

        if (sub.subscribedAt == 0) revert NotSubscribed();
        if (sub.owner != msg.sender) revert NotSubscriptionOwner();
        if (!sub.isActive) revert SubscriptionAlreadyPaused();

        sub.isActive = false;
        sub.pausedAt = uint64(block.timestamp);
        subscriberCounts[strategyId]--;

        emit SubscriptionPaused(strategyId, delegationWallet, block.timestamp);
    }

    /**
     * @notice Reactivate a paused subscription
     * @param strategyId The strategy
     * @param delegationWallet The subscribed wallet
     */
    function activateSubscription(bytes32 strategyId, address delegationWallet) external {
        Subscription storage sub = subscriptions[strategyId][delegationWallet];

        if (sub.subscribedAt == 0) revert NotSubscribed();
        if (sub.owner != msg.sender) revert NotSubscriptionOwner();
        if (sub.isActive) revert SubscriptionAlreadyActive();

        sub.isActive = true;
        sub.pausedAt = 0;
        subscriberCounts[strategyId]++;

        emit SubscriptionActivated(strategyId, delegationWallet, block.timestamp);
    }

    /**
     * @notice Update the delegation wallet for a subscription
     * @param strategyId The strategy
     * @param oldWallet The current wallet
     * @param newWallet The new wallet to migrate to
     */
    function updateSubscriptionWallet(bytes32 strategyId, address oldWallet, address newWallet) external {
        Subscription storage sub = subscriptions[strategyId][oldWallet];

        if (sub.subscribedAt == 0) revert NotSubscribed();
        if (sub.owner != msg.sender) revert NotSubscriptionOwner();
        if (subscriptions[strategyId][newWallet].subscribedAt != 0) revert NewWalletAlreadySubscribed();

        // Copy subscription to new wallet
        subscriptions[strategyId][newWallet] = Subscription({
            owner: sub.owner,
            delegationWallet: newWallet,
            isActive: sub.isActive,
            subscribedAt: sub.subscribedAt,
            pausedAt: sub.pausedAt
        });

        // Clear old subscription
        delete subscriptions[strategyId][oldWallet];

        // Update userSubscriptionWallets array
        address[] storage wallets = userSubscriptionWallets[strategyId][msg.sender];
        for (uint256 i = 0; i < wallets.length; i++) {
            if (wallets[i] == oldWallet) {
                wallets[i] = newWallet;
                break;
            }
        }

        emit SubscriptionWalletUpdated(strategyId, oldWallet, newWallet, block.timestamp);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /**
     * @notice Check if a buyer has purchased a strategy
     * @param strategyId UUID of the strategy
     * @param buyer Address of the potential buyer
     * @return True if purchased
     */
    function hasPurchased(bytes32 strategyId, address buyer) external view returns (bool) {
        return purchases[strategyId][buyer];
    }

    /**
     * @notice Get listing details
     * @param strategyId UUID of the strategy
     * @return creator The creator address
     * @return priceMnt The price in MNT
     * @return isActive Whether the listing is active
     */
    function getListing(bytes32 strategyId) external view returns (
        address creator,
        uint256 priceMnt,
        bool isActive
    ) {
        Listing storage listing = listings[strategyId];
        return (listing.creator, listing.priceMnt, listing.isActive);
    }

    /**
     * @notice Get subscription details
     * @param strategyId The strategy
     * @param delegationWallet The wallet address
     */
    function getSubscription(bytes32 strategyId, address delegationWallet) external view returns (
        address owner,
        bool isActive,
        uint64 subscribedAt,
        uint64 pausedAt
    ) {
        Subscription storage sub = subscriptions[strategyId][delegationWallet];
        return (sub.owner, sub.isActive, sub.subscribedAt, sub.pausedAt);
    }

    /**
     * @notice Check if a wallet is actively subscribed to a strategy
     * @param strategyId The strategy
     * @param delegationWallet The wallet address
     */
    function isSubscribed(bytes32 strategyId, address delegationWallet) external view returns (bool) {
        Subscription storage sub = subscriptions[strategyId][delegationWallet];
        return sub.subscribedAt != 0 && sub.isActive;
    }

    /**
     * @notice Get active subscriber count for a strategy
     * @param strategyId The strategy
     */
    function getSubscriberCount(bytes32 strategyId) external view returns (uint256) {
        return subscriberCounts[strategyId];
    }

    /**
     * @notice Get all delegation wallets a user has subscribed to a strategy
     * @param strategyId The strategy
     * @param owner The user address
     */
    function getUserSubscriptions(bytes32 strategyId, address owner) external view returns (address[] memory) {
        return userSubscriptionWallets[strategyId][owner];
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /**
     * @notice Update the protocol fee
     * @param newFeeBps New fee in basis points (max 1000 = 10%)
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 1000) revert InvalidFee();
        protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }

    /**
     * @notice Update the treasury address
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert InvalidTreasury();
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /**
     * @notice Withdraw accumulated protocol fees to treasury
     */
    function withdrawProtocolFees() external onlyOwner nonReentrant {
        uint256 amount = protocolFees;
        if (amount == 0) revert NoBalanceToWithdraw();

        protocolFees = 0;

        (bool success, ) = payable(treasury).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit TreasuryWithdraw(treasury, amount);
    }
}
