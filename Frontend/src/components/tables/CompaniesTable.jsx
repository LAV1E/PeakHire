"use client";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Building2, Check, X } from "lucide-react";
import Image from "next/image";
export function CompaniesTable({ companies, onApprove, onReject, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-10">Loading companies...</div>;
  }
  if (!companies.length) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-lg border border-outline-variant ">
        {" "}
        <Building2 size={40} className="mx-auto mb-4 text-on-surface-variant/30 " />{" "}
        <h3 className="font-semibold text-on-surface-variant ">
          {" "}
          No companies found{" "}
        </h3>{" "}
      </div>
    );
  }
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      {" "}
      <div className="overflow-x-auto">
        {" "}
        <table className="w-full text-sm text-left">
          {" "}
          <thead className="bg-surface-container-low text-xs text-on-surface-variant uppercase">
            {" "}
            <tr>
              {" "}
              <th className="px-5 py-3">Company</th>{" "}
              <th className="px-5 py-3">Industry / Size</th>{" "}
              <th className="px-5 py-3">Location</th>{" "}
              <th className="px-5 py-3">Status</th>{" "}
              <th className="px-5 py-3">Joined</th>{" "}
              <th className="px-5 py-3 text-right">Actions</th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody className="divide-y ">
            {" "}
            {companies.map((company) => (
              <tr
                key={company._id}
                className="transition-colors duration-200 ease-out hover:bg-surface-container-low "
              >
                {" "}
                <td className="px-5 py-3">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center border border-outline-variant overflow-hidden">
                      {" "}
                      {company.logo?.url ? (
                        <Image
                          src={company.logo.url}
                          alt={company.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <Building2 size={16} className="text-on-surface-variant" />
                      )}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <div className="font-medium text-on-surface ">
                        {" "}
                        {company.name}{" "}
                      </div>{" "}
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {" "}
                          {company.website.replace(/^https?:\/\//, "")}{" "}
                        </a>
                      )}{" "}
                    </div>{" "}
                  </div>{" "}
                </td>{" "}
                <td className="px-5 py-3 text-on-surface-variant ">
                  {" "}
                  <div>{company.industry}</div>{" "}
                  <div className="text-xs">{company.companySize} emp.</div>{" "}
                </td>{" "}
                <td className="px-5 py-3 text-on-surface-variant ">
                  {" "}
                  {company.location}{" "}
                </td>{" "}
                <td className="px-5 py-3">
                  {" "}
                  {company.isVerified ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {" "}
                      Verified{" "}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {" "}
                      Pending{" "}
                    </span>
                  )}{" "}
                </td>{" "}
                <td className="px-5 py-3 text-on-surface-variant ">
                  {" "}
                  {company.createdAt ? formatDate(company.createdAt) : "-"}{" "}
                </td>{" "}
                <td className="px-5 py-3">
                  {" "}
                  <div className="flex items-center justify-end gap-2">
                    {" "}
                    {!company.isVerified && onApprove && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-green-600 transition-colors duration-200 ease-out hover:text-green-700 transition-colors duration-200 ease-out hover:bg-green-50 "
                        onClick={() => onApprove(company._id)}
                      >
                        {" "}
                        <Check size={14} />{" "}
                      </Button>
                    )}{" "}
                    {!company.isVerified && onReject && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 transition-colors duration-200 ease-out hover:text-red-700 transition-colors duration-200 ease-out hover:bg-red-50 "
                        onClick={() => onReject(company._id)}
                      >
                        {" "}
                        <X size={14} />{" "}
                      </Button>
                    )}{" "}
                  </div>{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
}
