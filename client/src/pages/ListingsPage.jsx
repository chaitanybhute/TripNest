import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getListings } from '../api/api';

const CATEGORIES = [
  { icon: 'fa-fire',          label: 'Trending' },
  { icon: 'fa-bed',           label: 'Rooms' },
  { icon: 'fa-mountain-city', label: 'Iconic cities' },
  { icon: 'fa-mountain',      label: 'Mountains' },
  { icon: 'fa-chess-rook',    label: 'Castles' },
  { icon: 'fa-person-swimming', label: 'Amazing Pools' },
  { icon: 'fa-campground',    label: 'Camping' },
  { icon: 'fa-cow',           label: 'Farms' },
  { icon: 'fa-snowflake',     label: 'Arctic' },
  { icon: 'fa-ship',          label: 'Boat' },
  { icon: 'fa-umbrella-beach', label: 'Beach' },
  { icon: 'fa-tree',          label: 'Forest' },
  { icon: 'fa-cloud-rain',    label: 'Tropical' },
  { icon: 'fa-igloo',         label: 'Dome' },
];

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    getListings()
      .then(({ listings }) => setListings(listings))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter: search query takes priority, then category filter
  const filtered = listings.filter(l => {
    const q = searchQuery.toLowerCase();
    if (q) {
      return (
        l.title?.toLowerCase().includes(q) ||
        l.location?.toLowerCase().includes(q) ||
        l.country?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner-border" style={{ color: '#fe424d' }} role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-3">

      {/* Category filters */}
      <div id="filters">
        {CATEGORIES.map(cat => (
          <div
            key={cat.label}
            className={`filter ${activeFilter === cat.label ? 'active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === cat.label ? null : cat.label)}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            <p className="mb-0">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Search result indicator */}
      {searchQuery && (
        <p className="text-muted mt-3">
          Showing results for: <strong>"{searchQuery}"</strong> —{' '}
          {filtered.length} found
        </p>
      )}

      {/* Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 mt-3 g-3">
        {filtered.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="fa-solid fa-magnifying-glass fa-2x mb-3"></i>
            <p>No listings found.</p>
          </div>
        ) : (
          filtered.map(listing => (
            <div key={listing._id} className="col">
              <Link to={`/listings/${listing._id}`} className="listing-link">
                <div className="listing-card card h-100">
                  <div style={{ position: 'relative' }}>
                    <img
                      className="card-img-top"
                      src={listing.image?.url || 'https://via.placeholder.com/400x300'}
                      alt={listing.title}
                    />
                    <div className="card-img-overlay-custom">Click to view…</div>
                  </div>
                  <div className="card-body">
                    <p className="card-text mb-0">
                      <strong>{listing.title}</strong><br />
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {listing.location}, {listing.country}
                      </span><br />
                      <span style={{ fontWeight: 500 }}>
                        &#8377;{listing.price?.toLocaleString('en-IN')} / night
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
