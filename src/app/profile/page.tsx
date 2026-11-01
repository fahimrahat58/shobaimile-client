"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  UserRound,
  Mail,
  Camera,
  ShieldCheck,
  Loader2,
  Pencil,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Profile = {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found");
    }

    return data.token;
  };

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

        const token = await getToken();

        const response = await fetch(`${API_URL}/api/profile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch profile");
        }

        if (!cancelled) {
          setProfile(result.user);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, router]);

  const openEditDialog = () => {
    if (!profile) return;

    setName(profile.name || "");
    setImage(profile.image || "");
    setIsEditOpen(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!image.trim()) {
      toast.error("Profile image URL is required");
      return;
    }

    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error("API URL is not configured");
      }

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/profile/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      if (!result.user) {
        throw new Error("Updated profile data not found");
      }

      // Update profile immediately without refreshing the page.
      setProfile({
        name: result.user.name,
        email: result.user.email,
        image: result.user.image,
        emailVerified: result.user.emailVerified,
      });

      setName(result.user.name);
      setImage(result.user.image);

      setIsEditOpen(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <UserRound className="h-12 w-12 text-muted-foreground" />

        <h2 className="text-xl font-semibold">Profile not found</h2>

        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  const initials =
    profile.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-background px-3 py-7 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">My Profile</h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage your personal information.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm sm:rounded-2xl">
          <div className="h-24 bg-gradient-to-r from-primary/80 to-primary sm:h-32 md:h-36" />

          <div className="px-4 pb-6 sm:px-6 sm:pb-8">
            <div className="-mt-12 flex flex-col items-start justify-between gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              <Avatar className="h-24 w-24 border-4 border-background sm:h-28 sm:w-28">
                <AvatarImage
                  src={profile.image || ""}
                  alt={profile.name}
                  key={profile.image}
                />

                <AvatarFallback className="text-xl sm:text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <Button
                onClick={openEditDialog}
                className="w-full gap-2 sm:w-auto"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="mt-5 min-w-0">
              <h2 className="break-words text-xl font-bold sm:text-2xl">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                ShobaiMile Member
              </p>
            </div>

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-5">
              <div className="flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4">
                <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 sm:p-3">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Full Name
                  </p>

                  <p className="break-words text-sm font-medium sm:text-base">
                    {profile.name}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4">
                <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 sm:p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Email Address
                  </p>

                  <p className="break-all text-sm font-medium sm:text-base">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4">
                <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 sm:p-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Email Verification
                  </p>

                  <p className="text-sm font-medium sm:text-base">
                    {profile.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-h-[90vh] w-[calc(100%-1rem)] overflow-y-auto rounded-xl p-4 sm:max-w-md sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Edit Profile
              </DialogTitle>

              <DialogDescription className="text-sm">
                Update your name and profile picture.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-4 sm:space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="pl-10"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>

                <div className="relative">
                  <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full gap-2 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
