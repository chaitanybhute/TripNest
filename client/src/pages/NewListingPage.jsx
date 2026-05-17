import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function NewListingPage() {
  const navigate = useNavigate();
  const { currentUser, showFlash } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    country: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (!imageFile) {
      showFlash('error', 'Please upload an image.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('listing[title]', form.title);
      fd.append('listing[description]', form.description);
      fd.append('listing[price]', form.price);
      fd.append('listing[country]', form.country);
      fd.append('listing[location]', form.location);
      fd.append('listing[image]', imageFile);

      const data = await createListing(fd);
      showFlash('success', 'New listing created!');
      navigate(`/listings/${data.listing._id}`);
    } catch (e) {
      showFlash('error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-7 col-md-9 col-12 mx-auto">
          <div className="form-page-card">
            <h3 className="mb-4">Add New Listing</h3>
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  placeholder="Enter title"
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
                  placeholder="Describe the place"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImage}
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-2 rounded"
                    style={{ maxHeight: '180px', objectFit: 'cover', width: '100%' }}
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
                    placeholder="e.g. 2500"
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
                    placeholder="e.g. India"
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
                  placeholder="e.g. Manali, Himachal Pradesh"
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
                {submitting ? 'Adding…' : 'Add Listing'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
