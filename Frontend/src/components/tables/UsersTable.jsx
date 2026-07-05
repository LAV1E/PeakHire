"use client";
import { AvatarWithFallback } from "@/components/common/AvatarWithFallback";
import { formatDate } from "@/utils/dateUtils";
import { Users, MoreVertical, Ban, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function UsersTable({ users, onToggleStatus, isLoading }) {
  if (isLoading) {
    return <div className="text-center py-10">Loading users...</div>;
  }
  if (!users.length) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-lg border border-outline-variant ">
        {" "}
        <Users size={40} className="mx-auto mb-4 text-on-surface-variant/30 " />{" "}
        <h3 className="font-semibold text-on-surface-variant "> No users found </h3>{" "}
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
              <th className="px-5 py-3">User</th>{" "}
              <th className="px-5 py-3">Role</th>{" "}
              <th className="px-5 py-3">Status</th>{" "}
              <th className="px-5 py-3">Joined</th>{" "}
              <th className="px-5 py-3 text-right">Actions</th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody className="divide-y ">
            {" "}
            {users.map((user) => (
              <tr
                key={user._id}
                className="transition-colors duration-200 ease-out hover:bg-surface-container-low "
              >
                {" "}
                <td className="px-5 py-3">
                  {" "}
                  <div className="flex items-center gap-3">
                    {" "}
                    <AvatarWithFallback
                      src={user.avatar?.url}
                      name={user.name}
                      size="sm"
                    />{" "}
                    <div>
                      {" "}
                      <div className="font-medium text-on-surface ">
                        {" "}
                        {user.name}{" "}
                      </div>{" "}
                      <div className="text-xs text-on-surface-variant ">
                        {" "}
                        {user.email}{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </td>{" "}
                <td className="px-5 py-3">
                  {" "}
                  <span className="capitalize text-on-surface-variant ">
                    {" "}
                    {user.role}{" "}
                  </span>{" "}
                </td>{" "}
                <td className="px-5 py-3">
                  {" "}
                  {user.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {" "}
                      Active{" "}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      {" "}
                      Inactive{" "}
                    </span>
                  )}{" "}
                </td>{" "}
                <td className="px-5 py-3 text-on-surface-variant ">
                  {" "}
                  {user.createdAt ? formatDate(user.createdAt) : "-"}{" "}
                </td>{" "}
                <td className="px-5 py-3 text-right">
                  {" "}
                  {onToggleStatus && (
                    <DropdownMenu>
                      {" "}
                      <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 rounded-md transition-colors duration-200 ease-out hover:bg-gray-100 transition-colors">
                        {" "}
                        <MoreVertical size={14} />{" "}
                      </DropdownMenuTrigger>{" "}
                      <DropdownMenuContent align="end">
                        {" "}
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleStatus(user._id, !!user.isActive)
                          }
                        >
                          {" "}
                          {user.isActive ? (
                            <>
                              {" "}
                              <Ban
                                size={14}
                                className="mr-2 text-red-500"
                              />{" "}
                              Deactivate{" "}
                            </>
                          ) : (
                            <>
                              {" "}
                              <CheckCircle
                                size={14}
                                className="mr-2 text-green-500"
                              />{" "}
                              Activate{" "}
                            </>
                          )}{" "}
                        </DropdownMenuItem>{" "}
                      </DropdownMenuContent>{" "}
                    </DropdownMenu>
                  )}{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
}
