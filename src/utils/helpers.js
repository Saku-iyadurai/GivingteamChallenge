export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};
 
export const calculateLeaderboardRank = (contributions) => {
    return contributions.sort((a, b) => b.amount - a.amount).map((contribution, index) => ({
        ...contribution,
        rank: index + 1,
    }));
};

export const getNonprofitLogo = (nonprofit) => {
    return nonprofit.logo || 'default-logo.png';
};