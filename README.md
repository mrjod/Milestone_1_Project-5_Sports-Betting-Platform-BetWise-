Sports Betting Platform (BetWise) 
Betting system where users bet on games with virtual funds. 
Main Features: - Admin creates games and odds 
6 
- Users place bets, view results - Payout based on outcomes 
Schemas: 
1. User info, wallet balance 
2. Game teams, odds, result 
3. Bet user, game, outcome, stake, payout 
Endpoints: - POST /auth/register - POST /auth/login - POST /games (admin) - GET /games - POST /bets - GET /bets - PATCH /games/:id/result - GET /walle
