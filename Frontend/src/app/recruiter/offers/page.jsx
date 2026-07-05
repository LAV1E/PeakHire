"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { offerApi } from "@/api/offer.api";
import { OfferCard } from "@/components/cards/OfferCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterOffersPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.OFFERS,
    queryFn: async () => {
      const res = await offerApi.recruiterList();
      return res.offers;
    },
  });
  
  const offers = data ?? [];

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto space-y-6 min-h-[calc(100vh-64px)] w-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">Sent Offers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage {offers.length} offer{offers.length !== 1 ? "s" : ""} sent to candidates.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl bg-surface-container-highest" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface/50 h-64">
          <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">featured_play_list</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-background mb-1">
            No offers sent yet
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Send offers to shortlisted candidates from their application page
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
