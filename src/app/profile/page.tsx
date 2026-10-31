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
  Eye,
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

  // Get JWT token
  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found");
    }

    return data.token;
  };

  // Fetch profile from Express backend
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      router.push("/login");
      return;
    }

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

        setProfile(result.user);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, isPending, router]);

  // Open edit dialog
  const openEditDialog = () => {
    if (!profile) return;

    setName(profile.name || "");
    setImage(profile.image || "");
    setIsEditOpen(true);
  };

  // Update profile through Express backend
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

      setProfile(result.user);

      toast.success("Profile updated successfully!");

      setIsEditOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Profile not found
  if (!profile) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
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
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>

          <p className="mt-2 text-muted-foreground">
            Manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Cover */}
          <div className="h-36 bg-gradient-to-r from-primary/80 to-primary" />

          <div className="px-6 pb-8">
            {/* Avatar and Edit Button */}
            <div className="-mt-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <Avatar className="h-28 w-28 border-4 border-background">
                <AvatarImage src={profile.image || ""} alt={profile.name} />

                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>

              <Button onClick={openEditDialog} className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Name */}
            <div className="mt-5">
              <h2 className="text-2xl font-bold">{profile.name}</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                ShobaiMile Member
              </p>
            </div>

            {/* Information */}
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>

                  <p className="font-medium">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Email Address</p>

                  <p className="break-all font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border p-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Email Verification
                  </p>

                  <p className="font-medium">
                    {profile.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>

              <DialogDescription>
                Update your name and profile picture.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Name */}
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

              {/* Email */}
              <div className="space-y-2">
                <Label>Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input value={profile.email} disabled className="pl-10" />
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Image */}
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

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={saving} className="gap-2">
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
