import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/currencyFormat";
import { getEmploymentTypeLabel } from "@/utils/statusHelpers";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function OfferCard({
  offer,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}) {
  const isPending = offer.status === "PENDING";
  const isExpired = new Date(offer.expiryDate) < new Date();
  return (
    <div
      className={cn(
        "bg-surface-container-lowest border rounded-lg p-5 transition-all duration-200 transition-shadow duration-200 ease-out hover:shadow-sm border border-outline-variant transition-shadow duration-200 ease-out hover:shadow-md",
        isPending && !isExpired ? "border-secondary/30 " : "border-outline-variant ",
      )}
    >
      {" "}
      <div className="flex items-start justify-between gap-3 mb-4">
        {" "}
        <div>
          {" "}
          <h3 className="font-semibold text-on-surface ">
            {" "}
            {offer.title}{" "}
          </h3>{" "}
          {offer.candidate && (
            <p className="text-sm text-on-surface-variant mt-0.5">
              {" "}
              {offer.candidate.name}{" "}
            </p>
          )}{" "}
        </div>{" "}
        <StatusBadge status={offer.status} variant="offer" />{" "}
      </div>{" "}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {" "}
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant ">
          {" "}
          <DollarSign size={14} className="text-green-500" />{" "}
          <span className="font-medium text-on-surface ">
            {" "}
            {formatCurrency(offer.salary)}{" "}
          </span>{" "}
        </div>{" "}
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant ">
          {" "}
          <Calendar size={14} /> {formatDate(offer.joiningDate)}{" "}
        </div>{" "}
        <div className="flex items-center gap-1.5 text-sm text-on-surface-variant ">
          {" "}
          <MapPin size={14} /> {offer.location}{" "}
        </div>{" "}
        <div className="text-sm text-on-surface-variant ">
          {" "}
          {getEmploymentTypeLabel(offer.employmentType)}{" "}
        </div>{" "}
      </div>{" "}
      {offer.notes && (
        <p className="text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 mb-4">
          {" "}
          {offer.notes}{" "}
        </p>
      )}{" "}
      <div className="text-xs text-on-surface-variant/70 mb-4">
        {" "}
        Expires: {formatDate(offer.expiryDate)}{" "}
        {isPending && !isExpired && (
          <span className="ml-2 text-orange-500 font-medium">
            {" "}
            · Awaiting response{" "}
          </span>
        )}{" "}
      </div>{" "}
      {isPending && !isExpired && (onAccept || onReject) && (
        <div className="flex gap-2">
          {" "}
          <Button
            size="sm"
            className="flex-1 bg-green-600 transition-colors duration-200 ease-out hover:bg-green-700 text-on-primary"
            onClick={() => onAccept?.(offer._id)}
            disabled={isAccepting}
          >
            {" "}
            {isAccepting ? "Accepting..." : "✓ Accept Offer"}{" "}
          </Button>{" "}
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-300 text-red-600 transition-colors duration-200 ease-out hover:bg-red-50 "
            onClick={() => onReject?.(offer._id)}
            disabled={isRejecting}
          >
            {" "}
            {isRejecting ? "Declining..." : "✗ Decline"}{" "}
          </Button>{" "}
        </div>
      )}{" "}
    </div>
  );
}
