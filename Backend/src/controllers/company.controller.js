import CompanyModel from "../models/company.model.js";
import userModel from "../models/user.model.js";
import { slugify } from "../utils/slugify.js";
import {

sendCompanyVerificationNotification,

} from "../services/notificationTemplates.service.js";

export async function createCompany(req,res) {
  try {
    const {
      name,
      description,
      website,
      industry,
      companySize,
      location,
    } = req.body;

    if (
      !name ||
      !industry ||
      !companySize ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, industry, company size and location are required",
      });
    }

    const existingCompany =
      await CompanyModel.findOne({
        owner: req.user.id,
      });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message:
          "Recruiter already owns a company",
      });
    }

    const slug = slugify(name);

    const slugExists =
      await CompanyModel.findOne({
        slug,
      });

    if (slugExists) {
      return res.status(409).json({
        success: false,
        message:
          "Company with this name already exists",
      });
    }

    const company =
      await CompanyModel.create({
        name,
        slug,
        description,
        website,
        industry,
        companySize,
        location,
        owner: req.user.id,
      });

    await userModel.findByIdAndUpdate(
      req.user.id,
      {
        companyId: company._id,
      }
    );

    return res.status(201).json({
      success: true,
      message:
        "Company created successfully",
      company,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to create company",
    });
  }
}

export async function getMyCompany(
  req,
  res
) {
  try {
    const company =
      await CompanyModel.findOne({
        owner: req.user.id,
      }).populate(
        "owner",
        "name email role"
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch company",
    });
  }
}

export async function updateCompany(
  req,
  res
) {
  try {
    const { id } = req.params;

    const company =
      await CompanyModel.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      company.owner.toString() !==
      req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (req.body.name) {
      req.body.slug = slugify(
        req.body.name
      );
    }

    const updatedCompany =
      await CompanyModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update company",
    });
  }
}
export async function deleteCompany(
  req,
  res
) {
  try {
    const { id } = req.params;

    const company =
      await CompanyModel.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      company.owner.toString() !==
      req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await CompanyModel.findByIdAndDelete(
      id
    );

    await userModel.findByIdAndUpdate(
      company.owner,
      {
        companyId: null,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Company deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete company",
    });
  }
}

export async function verifyCompany(req, res) {
  try {
    const { id } = req.params;

    const company = await CompanyModel.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Company is already verified",
      });
    }

    company.isVerified = true;
    company.verifiedBy = req.user.id;
    company.verifiedAt = new Date();

    await company.save();
      

    await sendCompanyVerificationNotification({

    company,

    recruiter:
        company.owner,

    sender:
        req.user.id,

    status:
        "VERIFIED",

    });
    return res.status(200).json({
      success: true,
      message: "Company verified successfully",
      company,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify company",
    });
  }
}

export async function getPendingCompanies(req, res) {
  try {

    const companies = await CompanyModel
      .find({
        isVerified: false,
      })
      .populate(
        "owner",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      total: companies.length,
      companies,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending companies",
    });
  }
}

// =====================================================
// Reject Company
// =====================================================

export async function rejectCompany(
  req,
  res
) {
  try {

    const { id } = req.params;

    const company =
      await CompanyModel.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!company.isVerified) {

      await sendCompanyVerificationNotification({

        company,

        recruiter: company.owner,

        sender: req.user.id,

        status: "REJECTED",

      });

      return res.status(200).json({

        success: true,

        message:
          "Company rejected successfully",

      });

    }

    return res.status(400).json({

      success: false,

      message:
        "Verified company cannot be rejected",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to reject company",

    });

  }
}