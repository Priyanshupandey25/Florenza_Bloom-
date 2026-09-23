/**
 * Metric Cards Component
 * Faithfully matches the 4 metric summary cards in the Stitch UI.
 */
export function MetricCards({ metrics = { total: 0, active: 0, lowStock: 0, drafts: 0, activePercentage: 0 } }) {
  return (
    <div className="seller-metrics-grid">
      {/* 1. Total Bouquets */}
      <div className="seller-metric-card">
        <div className="seller-metric-header">
          <span className="seller-metric-label">TOTAL BOUQUETS</span>
          <div className="seller-metric-icon-circle icon-flower">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2a4 4 0 0 0-4 4c0 3 4 6 4 6s4-3 4-6a4 4 0 0 0-4-4z"/>
              <path d="M22 12a4 4 0 0 0-4-4c-3 0-6 4-6 4s3 4 6 4a4 4 0 0 0 4-4z"/>
              <path d="M12 22a4 4 0 0 0 4-4c0-3-4-6-4-6s-4 3-4 6a4 4 0 0 0 4 4z"/>
              <path d="M2 12a4 4 0 0 0 4 4c3 0 6-4 6-4s-3-4-6-4a4 4 0 0 0-4 4z"/>
            </svg>
          </div>
        </div>
        <div className="seller-metric-body">
          <span className="seller-metric-value">{metrics.total}</span>
          <span className="seller-metric-subtext">
            {metrics.total > 0 ? "+3 this week" : "Studio ready"}
          </span>
        </div>
        <div className="seller-metric-bar bar-brown" />
      </div>

      {/* 2. Active Listings */}
      <div className="seller-metric-card">
        <div className="seller-metric-header">
          <span className="seller-metric-label">ACTIVE LISTINGS</span>
          <div className="seller-metric-icon-circle icon-active">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
        </div>
        <div className="seller-metric-body">
          <span className="seller-metric-value">{metrics.active}</span>
          <span className="seller-metric-subtext">
            {metrics.activePercentage}% public
          </span>
        </div>
        <div className="seller-metric-bar bar-green" />
      </div>

      {/* 3. Low Stock Alert */}
      <div className="seller-metric-card">
        <div className="seller-metric-header">
          <span className="seller-metric-label">LOW STOCK ALERT</span>
          <div className="seller-metric-icon-circle icon-alert">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>
        <div className="seller-metric-body">
          <span className="seller-metric-value text-alert">{metrics.lowStock}</span>
          <span className="seller-metric-subtext text-alert">
            {metrics.lowStock > 0 ? "Need restock" : "Optimal levels"}
          </span>
        </div>
        <div className="seller-metric-bar bar-red" />
      </div>

      {/* 4. Draft Studio */}
      <div className="seller-metric-card">
        <div className="seller-metric-header">
          <span className="seller-metric-label">DRAFT STUDIO</span>
          <div className="seller-metric-icon-circle icon-draft">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
        </div>
        <div className="seller-metric-body">
          <span className="seller-metric-value">{metrics.drafts}</span>
          <span className="seller-metric-subtext">
            {metrics.drafts > 0 ? `${metrics.drafts} unpublished` : "All published"}
          </span>
        </div>
        <div className="seller-metric-bar bar-purple" />
      </div>
    </div>
  );
}

export default MetricCards;
