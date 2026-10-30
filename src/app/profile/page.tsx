"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserRound, Mail, Camera, ShieldCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  const user = session?.user;

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image.trim()) {
      toast.error("Profile image URL is required");
      return;
    }

    try {
      setSaving(true);

      const { error } = await authClient.updateUser({
        image: image.trim(),
      });

      if (error) {
        throw new Error(error.message || "Profile update failed");
      }

      toast.success("Profile picture updated successfully!");
      setImage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <UserRound className="mb-4 h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
        <p className="mt-2 text-gray-600">
          View your profile after logging in.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="mt-5 bg-cyan-600 hover:bg-cyan-700"
        >
          Login
        </Button>
      </main>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="font-semibold text-cyan-700">YOUR ACCOUNT</span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-gray-600">
            Manage your personal information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-500 px-6 py-10 text-center">
            <Avatar className="mx-auto h-28 w-28 border-4 border-white shadow-lg">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-white text-2xl font-bold text-cyan-700">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-2xl font-bold text-white">{user.name}</h2>

            <p className="mt-1 text-sm text-cyan-50">Community Member</p>
          </div>

          <div className="space-y-8 p-6 sm:p-10">
            <div>
              <h3 className="mb-5 text-lg font-bold text-gray-900">
                Personal Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <UserRound size={17} />
                    Full Name
                  </div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={17} />
                    Email Address
                  </div>
                  <p className="break-all font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck size={17} />
                    Email Verification
                  </div>
                  <p className="font-semibold text-gray-900">
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Update Profile Picture
              </h3>

              <p className="mb-5 text-sm text-gray-500">
                Enter a publicly accessible image URL to update your photo.
              </p>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="profile-image">Image URL</Label>
                  <div className="relative mt-2">
                    <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="profile-image"
                      type="url"
                      placeholder="https://example.com/profile.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 sm:w-auto"
                >
                  {saving ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
