export default function Loading() {
  return (
    <main className="dailybet-loader" role="status" aria-live="polite" aria-label="Loading DailyBet">
      <div className="dailybet-loader__content">
        <div className="dailybet-loader__wordmark" aria-label="DailyBet">
          <span>daily</span><strong>Bet</strong>
        </div>
        <div className="dailybet-loader__track" aria-hidden="true">
          <span className="dailybet-loader__ball" />
        </div>
        <p className="dailybet-loader__message">Getting the action ready…</p>
      </div>
      <span className="dailybet-loader__footer">EVERY MATCH. EVERY MOMENT.</span>
    </main>
  );
}
