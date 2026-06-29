import OfferModel from "../models/offer.model.js";
import ApplicationModel from "../models/application.model.js";

import {
  sendOfferNotification,
} from "../services/notificationTemplates.service.js";

// =====================================================
// Create Offer
// =====================================================

export async function createOffer(
  req,
  res
) {
  try {

    const {
      applicationId,
      title,
      salary,
      joiningDate,
      employmentType,
      location,
      notes,
      expiryDate,
    } = req.body;

    // ==========================
    // Required Fields
    // ==========================

    if (
      !applicationId ||
      !title ||
      !salary ||
      !joiningDate ||
      !employmentType ||
      !location ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided",
      });
    }

    // ==========================
    // Validate Joining Date
    // ==========================

    const joining =
      new Date(joiningDate);

    if (
      isNaN(joining.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid joining date",
      });
    }

    if (
      joining <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Joining date must be in the future",
      });
    }

    // ==========================
    // Validate Expiry Date
    // ==========================

    const expiry =
      new Date(expiryDate);

    if (
      isNaN(expiry.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid expiry date",
      });
    }

    if (
      expiry <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry date must be in the future",
      });
    }

    // ==========================
    // Application
    // ==========================

    const application =
      await ApplicationModel.findOne({
        _id: applicationId,
        isDeleted: false,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    // ==========================
    // Recruiter Ownership
    // ==========================

    if (
      application.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    // ==========================
    // Application Status
    // ==========================

    if (
      application.status !==
      "UNDER_REVIEW"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Offer can only be created after interview evaluation",
      });
    }

    // ==========================
    // Duplicate Pending Offer
    // ==========================

    const existingOffer =
      await OfferModel.findOne({
        application: applicationId,
        status: "PENDING",
        isDeleted: false,
      });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        message:
          "A pending offer already exists",
      });
    }

    // ==========================
    // Create Offer
    // ==========================

    const offer =
      await OfferModel.create({

        application:
          application._id,

        candidate:
          application.candidate,

        recruiter:
          application.recruiter,

        company:
          application.company,

        job:
          application.job,

        title,

        salary,

        joiningDate,

        employmentType,

        location,


        notes,

        expiryDate,

      });

    // ==========================
    // Update Application
    // ==========================

    await ApplicationModel.findByIdAndUpdate(
      application._id,
      {
        status: "OFFERED",
      }
    );

    // ==========================
    // Notification
    // ==========================

    await sendOfferNotification({

      offer,

      sender:
        req.user.id,

    });

    return res.status(201).json({

      success: true,

      message:
        "Offer created successfully",

      offer,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create offer",

    });

  }
}

// =====================================================
// Get Recruiter Offers
// =====================================================

export async function getRecruiterOffers(
  req,
  res
) {
  try {

    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {

      recruiter:
        req.user.id,

      isDeleted: false,

    };

    if (status) {
      query.status = status;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [
      offers,
      totalOffers,
    ] = await Promise.all([

      OfferModel.find(query)

        .populate(
          "candidate",
          "name email avatar"
        )

        .populate(
          "company",
          "name logo"
        )

        .populate(
          "job",
          "title"
        )

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(Number(limit)),

      OfferModel.countDocuments(
        query
      ),

    ]);

    return res.status(200).json({

      success: true,

      pagination: {

        totalItems:
          totalOffers,

        currentPage:
          Number(page),

        pageSize:
          Number(limit),

        totalPages:
          Math.ceil(
            totalOffers /
            Number(limit)
          ),

      },

      offers,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offers",

    });

  }
}

// =====================================================
// Get Candidate Offers
// =====================================================

export async function getCandidateOffers(
  req,
  res
) {
  try {

    const {
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      candidate: req.user.id,
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [
      offers,
      totalOffers,
    ] = await Promise.all([

      OfferModel.find(query)
        .populate(
          "company",
          "name logo"
        )
        .populate(
          "job",
          "title"
        )
        .populate(
          "recruiter",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit)),

      OfferModel.countDocuments(query),

    ]);

    return res.status(200).json({

      success: true,

      pagination: {

        totalItems:
          totalOffers,

        currentPage:
          Number(page),

        pageSize:
          Number(limit),

        totalPages:
          Math.ceil(
            totalOffers /
            Number(limit)
          ),

      },

      offers,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offers",

    });

  }
}

// =====================================================
// Get Offer By Id
// =====================================================

export async function getOfferById(
  req,
  res
) {
  try {

    const { id } = req.params;

    const offer =
      await OfferModel.findOne({

        _id: id,

        isDeleted: false,

      })
        .populate(
          "candidate",
          "name email avatar"
        )
        .populate(
          "company"
        )
        .populate(
          "job"
        )
        .populate(
          "application"
        );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message:
          "Offer not found",
      });
    }

    if (
      req.user.role === "candidate" &&
      offer.candidate._id.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    if (
      req.user.role === "recruiter" &&
      offer.recruiter.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    return res.status(200).json({

      success: true,

      offer,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch offer",

    });

  }
}

// =====================================================
// Accept Offer
// =====================================================

export async function acceptOffer(
  req,
  res
) {
  try {

    const { id } = req.params;

    const offer =
      await OfferModel.findOne({

        _id: id,

        candidate: req.user.id,

        isDeleted: false,

      });

    if (!offer) {

      return res.status(404).json({

        success: false,

        message:
          "Offer not found",

      });

    }

    if (
      offer.status !==
      "PENDING"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Offer already processed",

      });

    }

    offer.status =
      "ACCEPTED";

    offer.respondedAt =
      new Date();

    await offer.save();

    await ApplicationModel.findByIdAndUpdate(

      offer.application,

      {

        status: "HIRED",

      }

    );

    return res.status(200).json({

      success: true,

      message:
        "Offer accepted successfully",

      offer,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to accept offer",

    });

  }
}

// =====================================================
// Reject Offer
// =====================================================

export async function rejectOffer(
  req,
  res
) {
  try {

    const { id } =
      req.params;

    const offer =
      await OfferModel.findOne({

        _id: id,

        candidate:
          req.user.id,

        isDeleted: false,

      });

    if (!offer) {

      return res.status(404).json({

        success: false,

        message:
          "Offer not found",

      });

    }

    if (
      offer.status !==
      "PENDING"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Offer has already been processed",

      });

    }

    // ==========================
    // Expiry Check
    // ==========================

    if (
      offer.expiryDate <
      new Date()
    ) {

      offer.status =
        "EXPIRED";

      await offer.save();

      return res.status(400).json({

        success: false,

        message:
          "Offer has expired",

      });

    }

    // ==========================
    // Reject Offer
    // ==========================

    offer.status =
      "REJECTED";

    offer.respondedAt =
      new Date();

    await offer.save();

    // ==========================
    // Update Application
    // ==========================

    await ApplicationModel.findByIdAndUpdate(

      offer.application,

      {

        status:
          "REJECTED",

      }

    );

    return res.status(200).json({

      success: true,

      message:
        "Offer rejected successfully",

      offer,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to reject offer",

    });

  }
}

// =====================================================
// Delete Offer
// =====================================================

export async function deleteOffer(
  req,
  res
) {
  try {

    const { id } = req.params;

    const offer =
      await OfferModel.findOne({

        _id: id,

        recruiter: req.user.id,

        isDeleted: false,

      });

    if (!offer) {

      return res.status(404).json({

        success: false,

        message:
          "Offer not found",

      });

    }

    offer.isDeleted = true;

    await offer.save();

    return res.status(200).json({

      success: true,

      message:
        "Offer deleted successfully",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete offer",

    });

  }
}