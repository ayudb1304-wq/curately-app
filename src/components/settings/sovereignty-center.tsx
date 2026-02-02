"use client";

import { useMemo, useState } from "react";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { hardDeleteMyData } from "@/app/_actions/sovereignty";
import { ProfileEditor } from "@/components/settings/profile-editor";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function SovereigntyCenter({ session: sessionProp }: { session?: Session | null }) {
  const { theme } = useTheme();
  const { data: sessionHook } = useSession();
  const session = sessionProp ?? sessionHook ?? null;

  const internalUid = session?.user?.internal_uid ?? null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [arming, setArming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggleChecked, setToggleChecked] = useState(false);

  const toggleClasses = useMemo(() => {
    return cn(
      toggleChecked ? theme.accentBg : "",
      toggleChecked && theme.id === "cyber" ? "text-black" : "",
    );
  }, [theme, toggleChecked]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
          Settings
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50"
            style={{ fontFamily: theme.signatureFont }}
          >
            Sovereignty Center
          </h1>
          <span className={cn("text-xs font-semibold", theme.accentText)}>• {theme.name}</span>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl">
          Control identity visibility, privacy posture, and the lifecycle of your first-party data.
        </p>
      </header>

      <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Shell Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="space-y-6">
                {/* Profile Editor */}
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4 sm:p-6">
                  <ProfileEditor session={session} />
                </div>

                {/* Golden Record ID */}
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-zinc-950 dark:text-zinc-50">
                        Identity Graph ID
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Your immutable Golden Record identifier
                      </div>
                    </div>
                    {internalUid ? (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        {internalUid}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="border border-zinc-200/60 dark:border-zinc-800/80">
                        Session unavailable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                        <div className="text-sm font-black text-zinc-950 dark:text-zinc-50">
                          Data Sovereignty Toggle
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                        Hard delete PII and revoke all linked platform tokens (including encrypted refresh tokens).
                        This action is irreversible and will sign you out.
                      </p>
                      <ul className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <li>• Deletes your Curately user record (cascades accounts/sessions/audience snapshots)</li>
                        <li>• Removes linked platform accounts from the Identity Graph</li>
                        <li>• Ends your authenticated session</li>
                      </ul>
                      {error && (
                        <div className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
                          {error}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={toggleChecked}
                        onCheckedChange={(checked) => {
                          setError(null);
                          if (checked) {
                            setConfirmOpen(true);
                          } else {
                            setToggleChecked(false);
                          }
                        }}
                        className={toggleClasses}
                        aria-label="Data sovereignty hard delete toggle"
                      />
                      <Label className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {toggleChecked ? "Armed" : "Off"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data">
              <div className="space-y-4">
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4">
                  <div className="text-sm font-black text-zinc-950 dark:text-zinc-50">
                    Data exports (Phase 1)
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Coming next: downloadable exports for invoices, identity snapshots, and linked platform metadata.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) {
            setToggleChecked(false);
            setArming(false);
            setError(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Confirm Data Sovereignty Hard Delete</DialogTitle>
            <DialogDescription>
              This permanently deletes your user record and revokes all linked platform tokens. You will be signed out.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-2xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4">
            <div className="text-sm font-black text-red-700 dark:text-red-300">
              Irreversible action
            </div>
            <div className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">
              If you proceed, Curately cannot restore your Identity Graph record.
            </div>
          </div>

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={arming}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                setArming(true);
                setError(null);
                setToggleChecked(true);

                const result = await hardDeleteMyData();
                if (!result.success) {
                  setError(result.error);
                  setArming(false);
                  setToggleChecked(false);
                  setConfirmOpen(false);
                  return;
                }

                // Sign out locally after the record is destroyed.
                await signOut({ callbackUrl: "/" });
              }}
              disabled={arming}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {arming ? "Deleting…" : "Delete my data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

