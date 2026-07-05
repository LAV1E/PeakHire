import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Offer API ────────────────────────────────────────────────────────────────

export const offerApi = {
  /**
   * POST /offers/create-offer
   * Authenticated: recruiter, admin
   * Application must be status UNDER_REVIEW; blocks duplicate pending offers
   */
  create: async (data) => {
    const res = await axiosInstance.post("/offers/create-offer", data);
    return res.data;
  },

  /**
   * GET /offers/get-Recruiter-Offers
   * Authenticated: recruiter, admin
   * NOTE: Exact casing required — capital R and O
   */
  recruiterList: async (params) => {
    const res = await axiosInstance.get("/offers/get-Recruiter-Offers", {
      params,
    });
    return res.data;
  },

  /**
   * DELETE /offers/delete-offer/:id
   * Authenticated: recruiter (must own), admin
   */
  deleteOffer: async (id) => {
    const res = await axiosInstance.delete(`/offers/delete-offer/${id}`);
    return res.data;
  },

  /**
   * GET /offers/get-offer
   * Authenticated: candidate, admin
   * NOTE: "get-offer" (plural endpoint name but returns candidate's offers)
   */
  candidateList: async (params) => {
    const res = await axiosInstance.get("/offers/get-offer", { params });
    return res.data;
  },

  /**
   * PATCH /offers/accept-offer/:id
   * Authenticated: candidate, admin
   * Offer must be PENDING — sets application status to HIRED
   */
  accept: async (id) => {
    const res = await axiosInstance.patch(`/offers/accept-offer/${id}`);
    return res.data;
  },

  /**
   * PATCH /offers/:id/reject-offer
   * Authenticated: candidate, admin
   * Offer must be PENDING — sets application status to REJECTED
   * NOTE: id is in the middle of the path
   */
  reject: async (id) => {
    const res = await axiosInstance.patch(`/offers/${id}/reject-offer`);
    return res.data;
  },

  // ─── BROKEN route — do NOT use ────────────────────────────────────────────
  // getById: — router.get("get-Offer-ById/:id", ...) is missing a leading slash
  // and will never match. Do not build UI for it until backend is fixed.

  // ─── Legacy names used in existing pages ─────────────────────────────────

  /** @deprecated use candidateList() */
  getMyOffers: async () => {
    const r = await offerApi.candidateList();
    return { success: true, data: r.offers };
  },

  /** @deprecated use recruiterList() */
  getAllOffers: async () => {
    const r = await offerApi.recruiterList();
    return {
      success: true,
      data: r.offers,
      total: r.pagination?.totalItems ?? 0,
    };
  },

  /** @deprecated use accept(id) */
  acceptOffer: async (id) => offerApi.accept(id),

  /** @deprecated use reject(id) */
  rejectOffer: async (id) => offerApi.reject(id),
};
