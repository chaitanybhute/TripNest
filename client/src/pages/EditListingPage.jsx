import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, updateListing } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, showFlash } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    country: '',
    location: '',
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getListing(id)
      .then(({ listing }) => {
        setForm({
          title: listing.title || '',
          description: listing.description || '',
          price: listing.price || '',
          country: listing.country || '',
          location: listing.location || '',
        });
        setCurrentImageUrl(listing.image?.url || '');
      })
      .catch(() => {
        showFlash('error', 'Listing not found.');
        navigate('/listings');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('listing[title]', form.title);
      fd.append('listing[description]', form.description);
      fd.append('listing[price]', form.price);
      fd.append('listing[country]', form.country);
      fd.append('listing[location]', form.location);
      if (imageFile) {
        fd.append('listing[image]', imageFile);
      }

      await updateListing(id, fd);
      showFlash('success', 'Listing updated!');
      navigate(`/listings/${id}`);
    } catch (e) {
      showFlash('error', e.message);
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-7 col-md-9 col-12 mx-auto">
          <div className="form-page-card">
            <h3 className="mb-4">Edit Listing</h3>
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Current image preview */}
              {currentImageUrl && (
                <div className="mb-2">
                  <label className="form-label">Current Image</label><br />
                  <img
                    src={currentImageUrl}
                    alt="current"
                    className="rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Upload new image (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImage}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="new preview"
                    className="mt-2 rounded"
                    style={{ maxHeight: '150px', objectFit: 'cover', width: '100%' }}
                  />
                )}
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label className="form-label">Price (₹ per night)</label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-7 mb-3">
                  <label className="form-label">Country</label>
                  <input
                    className="form-control"
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-tripnest w-100"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
