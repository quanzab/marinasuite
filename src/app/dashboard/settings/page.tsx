
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUserProfile } from "@/lib/firestore";
import { userFormSchema } from "@/lib/types";

// Use the main user schema and pick only the fields needed for this form
const settingsFormSchema = userFormSchema.pick({ name: true });
export type UpdateUserFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const { toast } = useToast();

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(settingsFormSchema),
        values: {
            name: user?.name || "",
        }
    });

    const { isSubmitting, isDirty } = form.formState;

    async function onSubmit(values: UpdateUserFormValues) {
        if (!user || !user.tenant) {
            toast({ variant: 'destructive', title: 'Error', description: 'User session not found.' });
            return;
        }

        try {
            await updateUserProfile(user.tenant, user.id, values);
            toast({ title: 'Success', description: 'Your profile has been updated successfully.' });
            // Optionally, force a refresh of user data if your hook doesn't auto-update
            // For now, a page reload is a simple way to reflect changes everywhere
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update your profile.' });
        }
    }

    if (isUserLoading) {
        return <SettingsSkeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" value={user?.email || ''} disabled />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input value={user?.role || ''} disabled />
                                </FormControl>
                            </FormItem>
                             <FormItem>
                                <FormLabel>Organization</FormLabel>
                                <FormControl>
                                    <Input value={user?.tenant || ''} disabled />
                                </FormControl>
                            </FormItem>

                            <Button type="submit" disabled={isSubmitting || !isDirty}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}


function SettingsSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-32" />
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-8 max-w-lg">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
