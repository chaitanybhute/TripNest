import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListing, deleteListing, createReview, deleteReview } from '../api/api';
import { useAuth } from '../context/AuthContext';

function StarDisplay({ rating }) {
  return (
    <span className="star-display">
      {[1, 2, 3, 4, 5].map(s => (
        <i key={s} className={`fa-${s <= rating ? 'solid' : 'regular'} fa-star`} style={{ fontSize: '0.9rem' }}></i>
      ))}
    </span>
  );
}

export default function ShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showFlash } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 3, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getListing(id)
      .then(({ listing }) => setListing(listing))
      .catch(() => {
        showFlash('error', 'Listing not found.');
        navigate('/listings');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = currentUser && listing?.owner?._id === currentUser._id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListing(id);
      showFlash('success', 'Listing deleted!');
      navigate('/listings');
    } catch (e) {
      showFlash('error', e.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createReview(id, { review: reviewForm });
      setListing(prev => ({
        ...prev,
        reviews: [...prev.reviews, data.review],
      }));
      setReviewForm({ rating: 3, comment: '' });
      showFlash('success', 'Review added!');
    } catch (e) {
      showFlash('error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id, reviewId);
      setListing(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r._id !== reviewId),
      }));
      showFlash('success', 'Review deleted!');
    } catch (e) {
      showFlash('error', e.message);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner-border" style={{ color: '#fe424d' }} role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 offset-lg-2 col-12">

          <h3 className="mb-3">{listing.title}</h3>

          {/* Listing card */}
          <div className="card show-card listing-card">
            <img
              src={listing.image?.url || 'https://via.placeholder.com/800x400'}
              className="show-img"
              alt={listing.title}
            />
            <div className="card-body p-3">
              <p className="mb-1">
                <span className="text-muted">Owned by</span> <i>{listing.owner?.username}</i>
              </p>
              <p className="mb-1">{listing.description}</p>
              <p className="mb-1">
                <strong>&#8377;{listing.price?.toLocaleString('en-IN')}</strong> / night
              </p>
              <p className="mb-1 text-muted">
                <i className="fa-solid fa-location-dot me-1"></i>
                {listing.location}, {listing.country}
              </p>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="btns px-3 pb-3">
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="btn btn-tripnest"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <hr className="my-4" />

          {/* Review form — logged in users only */}
          {currentUser && (
            <div className="mb-4">
              <h4>Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                {/* Star rating */}
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <label key={n} style={{ cursor: 'pointer', fontSize: '1.6rem', color: n <= reviewForm.rating ? '#fe424d' : '#ccc' }}>
                        <input
                          type="radio"
                          name="rating"
                          value={n}
                          className="d-none"
                          checked={reviewForm.rating === n}
                          onChange={() => setReviewForm(f => ({ ...f, rating: n }))}
                        />
                        <i className="fa-solid fa-star"></i>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    required
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  />
                </div>

                <button
                  className="btn btn-tripnest"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
              <hr className="my-4" />
            </div>
          )}

          {/* All reviews */}
          <h4>All Reviews {listing.reviews?.length > 0 && `(${listing.reviews.length})`}</h4>

          {listing.reviews?.length === 0 && (
            <p className="text-muted mt-2">No reviews yet. Be the first!</p>
          )}

          <div className="row mt-3">
            {listing.reviews?.map(review => (
              <div key={review._id} className="col-md-6 col-12 mb-3">
                <div className="review-card">
                  <h6 className="mb-1">@{review.author?.username}</h6>
                  <StarDisplay rating={review.rating} />
                  <p className="mt-2 mb-2">{review.comment}</p>
                  {currentUser && review.author?._id === currentUser._id && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
