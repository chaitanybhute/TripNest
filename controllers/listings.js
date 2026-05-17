const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.json({ listings: allListing });
};

module.exports.renderNewForm = (req, res) => {
    // React handles the form UI; this endpoint is no longer needed
    res.json({ message: "Use the React frontend to create a listing." });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        return res.status(404).json({ error: "Listing you requested for does not exist!" });
    }

    res.json({ listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();

    res.json({ success: true, message: "New Listing created!", listing: newListing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing you requested for does not exist!" });
    }
    res.json({ listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // req.body.listing may come as JSON or form-data
    const updateData = req.body.listing || req.body;

    let listing = await Listing.findByIdAndUpdate(id, { ...updateData }, { new: true });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    res.json({ success: true, message: "Listing Updated!", listing });
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ success: true, message: "Listing Deleted!" });
};