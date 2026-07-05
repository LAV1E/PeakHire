"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { offerApi } from "@/api/offer.api";
import { OfferCard } from "@/components/cards/OfferCard";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { toast } from "sonner";

export default function CandidateOffersPage() {
  const queryClient = useQueryClient();
  const [acceptId, setAcceptId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.OFFERS,
    queryFn: async () => await offerApi.candidateList(),
  });
  const acceptMutation = useMutation({
    mutationFn: (id) => offerApi.acceptOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OFFERS });
      toast.success("Offer accepted! 🎉");
      setAcceptId(null);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Failed to accept offer"),
  });
  const rejectMutation = useMutation({
    mutationFn: (id) => offerApi.rejectOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OFFERS });
      toast.success("Offer declined");
      setRejectId(null);
    },
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Failed to decline offer"),
  });
  const offers = data?.offers ?? [];
  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto min-h-[calc(100vh-64px)]">
      <header className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-2">My Offers</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {offers.length} offer{offers.length !== 1 ? "s" : ""}
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 h-64"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-outline-variant border-dashed rounded-xl bg-surface-bright">
          <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">card_giftcard</span>
          </div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">No offers yet</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Job offers will appear here when recruiters send them. Keep applying and doing great in interviews!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              onAccept={(id) => setAcceptId(id)}
              onReject={(id) => setRejectId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!acceptId}
        onOpenChange={() => setAcceptId(null)}
        title="Accept Offer"
        description="Are you sure you want to accept this offer? You'll be confirming your employment."
        confirmLabel="Accept Offer"
        variant="default"
        onConfirm={() => acceptMutation.mutate(acceptId)}
        isLoading={acceptMutation.isPending}
      />
      
      <ConfirmModal
        open={!!rejectId}
        onOpenChange={() => setRejectId(null)}
        title="Decline Offer"
        description="Are you sure you want to decline this offer? This action cannot be undone."
        confirmLabel="Decline Offer"
        onConfirm={() => rejectMutation.mutate(rejectId)}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
