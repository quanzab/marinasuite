
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userFormSchema, type User, type UserFormValues } from "@/lib/types"
import { useEffect } from "react"


interface UserFormProps {
  user: User | null;
  onSubmit: (data: UserFormValues) => void;
  isSubmitting: boolean;
  isAdmin: boolean;
}

export function UserForm({ user, onSubmit, isSubmitting, isAdmin }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Viewer",
      tenant: user?.tenant || "Global Maritime",
    },
  })

  useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Viewer",
      tenant: user?.tenant || "Global Maritime",
    });
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={!!user} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} disabled={!!user} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tenant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant</FormLabel>
              <FormControl>
                <Input placeholder="Global Maritime" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !isAdmin}>
          {isSubmitting ? 'Saving...' : (user ? 'Save Changes' : 'Invite User')}
        </Button>
      </form>
    </Form>
  )
}
